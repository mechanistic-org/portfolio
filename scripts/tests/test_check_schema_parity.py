import importlib.util
import unittest
from pathlib import Path


MODULE_PATH = Path(__file__).resolve().parents[1] / "check_schema_parity.py"
SPEC = importlib.util.spec_from_file_location("check_schema_parity", MODULE_PATH)
schema_parity = importlib.util.module_from_spec(SPEC)
assert SPEC.loader is not None
SPEC.loader.exec_module(schema_parity)


ZOD_SAMPLE = """
const otherPagesCollection = defineCollection({
  schema: () => z.object({
    sidebar: z.object({ order: z.number() }),
  }),
});

const projectsCollection = defineCollection({
  schema: () =>
    z.object({
      title: z.string(),
      links: z.array(z.object({
        name: z.string().optional(),
        url: z.string(),
      })),
      metrics: z.object({
        financial: z.object({
          dcos: z.number().optional(),
        }).optional(),
      }).optional(),
      statusLabel: z.string().optional(),
    }),
});
"""


KEYSTATIC_SAMPLE = """
export default config({
  collections: {
    otherPages: collection({
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
      },
    }),
    projects: collection({
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        links: fields.array(fields.object({
          name: fields.text({ label: "Name" }),
          url: fields.text({ label: "URL" }),
        })),
        statusLabel: fields.text({ label: "Status" }),
      },
    }),
  },
});
"""


class SchemaParityTests(unittest.TestCase):
    def test_extracts_only_project_top_level_zod_fields(self):
        fields = schema_parity.get_project_zod_fields(ZOD_SAMPLE)

        self.assertEqual(fields, {"title", "links", "metrics", "statusLabel"})
        self.assertNotIn("dcos", fields)
        self.assertNotIn("sidebar", fields)

    def test_extracts_only_project_top_level_keystatic_fields(self):
        fields = schema_parity.get_project_keystatic_fields(KEYSTATIC_SAMPLE)

        self.assertEqual(fields, {"title", "links", "statusLabel"})
        self.assertNotIn("name", fields)
        self.assertNotIn("url", fields)

    def test_detached_fields_are_allowed(self):
        missing = schema_parity.find_missing_fields(ZOD_SAMPLE, KEYSTATIC_SAMPLE)

        self.assertEqual(missing, [])

    def test_real_top_level_drift_is_reported(self):
        keystatic_without_status = KEYSTATIC_SAMPLE.replace(
            '        statusLabel: fields.text({ label: "Status" }),\n',
            "",
        )

        missing = schema_parity.find_missing_fields(ZOD_SAMPLE, keystatic_without_status)

        self.assertEqual(missing, ["statusLabel"])


if __name__ == "__main__":
    unittest.main()
