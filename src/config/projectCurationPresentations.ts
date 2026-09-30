import type { ProjectPresentation } from "../utils/projectPresentation";

/** Reviewed campaign #229 presentations; prose remains canon-owned. */
export const projectCurationPresentations: Record<string, ProjectPresentation> = {
  "c24": {
    "sections": {
      "summary": "i-project-summary",
      "product": "ii-the-product-that-shipped",
      "failures": "iii-design-and-production",
      "thermal": "1-paint-curing-and-side-cap-fit",
      "supply-chain": "2-recovering-top-panel-fabrication",
      "architecture": "3-a-quiet-low-profile-console",
      "serviceability": "4-a-field-replaceable-headphone-jack",
      "integration": "5-board-to-mechanical-interfaces",
      "regulatory": "6-power-supply-certification",
      "components": "7-controls-and-molded-part-geometry",
      "governance": "iv-production-acceptance-and-release",
      "impact": "v-results",
      "curation-12": "sustaining-the-inspection-definition"
    },
    "media": {
      "c24-render-01": {
        "galleryId": "01_origin_story",
        "src": "/assets/r2/c24/bubbles/01_origin_story/c24-render-01.png"
      },
      "c24-prototype-01": {
        "galleryId": "01_origin_story",
        "src": "/assets/r2/c24/bubbles/01_origin_story/c24-prototype-01-xl.webp"
      },
      "c24-render-02": {
        "galleryId": "01_origin_story",
        "src": "/assets/r2/c24/bubbles/01_origin_story/c24-render-02.png"
      },
      "c24-prototype-02": {
        "galleryId": "01_origin_story",
        "src": "/assets/r2/c24/bubbles/01_origin_story/c24-prototype-02-xl.webp"
      },
      "step-01-defect-gap": {
        "galleryId": "02_side_cap_crisis",
        "src": "/assets/r2/c24/bubbles/02_side_cap_crisis/step-01-defect-gap.jpg"
      },
      "step-03-method-a-fix": {
        "galleryId": "02_side_cap_crisis",
        "src": "/assets/r2/c24/bubbles/02_side_cap_crisis/step-03-method-a-fix.png"
      },
      "step-04-validation-report": {
        "galleryId": "02_side_cap_crisis",
        "src": "/assets/r2/c24/bubbles/02_side_cap_crisis/step-04-validation-report.png"
      },
      "metal-bends": {
        "galleryId": "03_manufacturing_wins",
        "src": "/assets/r2/c24/bubbles/03_manufacturing_wins/metal-bends.png"
      },
      "metal-bends_2": {
        "galleryId": "03_manufacturing_wins",
        "src": "/assets/r2/c24/bubbles/03_manufacturing_wins/metal-bends_2.png"
      },
      "eco-12993": {
        "galleryId": "05_paper_trail",
        "src": "/assets/r2/c24/05-paper-trail/eco-12993-xl.webp"
      },
      "DCD_9150-55200-00_REV_12_Page_1": {
        "galleryId": "03_manufacturing_wins",
        "src": "/assets/r2/c24/bubbles/03_manufacturing_wins/DCD_9150-55200-00_REV_12_Page_1.png"
      },
      "DCD_9150-55200-00_REV_12_Page_1_REV-block": {
        "galleryId": "05_paper_trail",
        "src": "/assets/r2/c24/bubbles/05_paper_trail/DCD_9150-55200-00_REV_12_Page_1_REV-block.png"
      },
      "c24-prototype-03": {
        "galleryId": "01_origin_story",
        "src": "/assets/r2/c24/bubbles/01_origin_story/c24-prototype-03-xl.webp"
      },
      "bournsem14page3": {
        "galleryId": "04_structural_components",
        "src": "/assets/r2/c24/bubbles/04_structural_components/bournsem14page3.png"
      },
      "forensic-1-1": {
        "galleryId": "04_structural_components",
        "src": "/assets/r2/c24/bubbles/04_structural_components/forensic-1-1.jpg"
      },
      "ECO_12262_Page_1": {
        "galleryId": "05_paper_trail",
        "src": "/assets/r2/c24/bubbles/05_paper_trail/ECO_12262_Page_1.png"
      },
      "dims-before-after-paint": {
        "galleryId": "02_side_cap_crisis",
        "src": "/assets/r2/c24/bubbles/02_side_cap_crisis/step-04-validation-report.png"
      },
      "c24-context-01": {
        "galleryId": "06_press_resources",
        "src": "/assets/r2/c24/bubbles/06_press_resources/c24-context-01.jpg"
      },
      "c24-render-07": {
        "galleryId": "06_press_resources",
        "src": "/assets/r2/c24/bubbles/06_press_resources/c24-render-07.png"
      },
      "ECO_12263_Page_1": {
        "galleryId": "05_paper_trail",
        "src": "/assets/r2/c24/bubbles/05_paper_trail/ECO_12263_Page_1.png"
      },
      "ECO_12263_Page_2": {
        "galleryId": "05_paper_trail",
        "src": "/assets/r2/c24/bubbles/05_paper_trail/ECO_12263_Page_2.png"
      },
      "review-meter-artwork-0": {
        "galleryId": "review-meter-artwork",
        "src": "/assets/c24/curation-20260930/c24-meter-artwork-revision-states.png"
      },
      "review-curtis-development-0": {
        "galleryId": "review-curtis-development",
        "src": "/assets/c24/curation-20260930/curtis-development-rendering-20061209.jpg"
      }
    },
    "inlineGalleries": [
      {
        "galleryId": "01_origin_story",
        "before": "failures"
      },
      {
        "galleryId": "02_side_cap_crisis",
        "before": "supply-chain"
      },
      {
        "galleryId": "03_manufacturing_wins",
        "before": "architecture"
      },
      {
        "galleryId": "04_structural_components",
        "before": "governance"
      },
      {
        "galleryId": "05_paper_trail",
        "before": "impact"
      },
      {
        "galleryId": "06_press_resources",
        "before": "impact"
      },
      {
        "galleryId": "review-meter-artwork",
        "before": "governance"
      },
      {
        "galleryId": "review-curtis-development",
        "before": "governance"
      }
    ],
    "scenes": [
      {
        "key": "summary",
        "parent": "summary",
        "eyebrow": "Orientation",
        "title": "Project Summary",
        "left": {
          "kind": "metrics",
          "keys": [
            "financial",
            "process",
            "governance"
          ]
        },
        "media": [
          "c24-render-01",
          "c24-prototype-01"
        ],
        "mediaLabel": "Form, mandate, and starting point"
      },
      {
        "key": "product",
        "parent": "product",
        "eyebrow": "Product",
        "title": "The Product That Shipped",
        "left": {
          "kind": "product"
        },
        "media": [
          "c24-render-02",
          "c24-prototype-02"
        ],
        "mediaLabel": "The shipped system and its physical vocabulary"
      },
      {
        "key": "failures",
        "parent": "failures",
        "eyebrow": "Engineering Decisions",
        "title": "Design and Production",
        "left": {
          "kind": "scar-index"
        },
        "media": [
          "step-01-defect-gap",
          "step-03-method-a-fix"
        ],
        "mediaLabel": "From defect to controlled intervention"
      },
      {
        "key": "thermal",
        "parent": "failures",
        "eyebrow": "Decision 01",
        "title": "Paint Curing and Side-Cap Fit",
        "left": {
          "kind": "scar",
          "section": "thermal"
        },
        "media": [
          "step-01-defect-gap",
          "step-04-validation-report"
        ],
        "mediaLabel": "Warp photograph and paint-process inspection table"
      },
      {
        "key": "supply-chain",
        "parent": "failures",
        "eyebrow": "Decision 02",
        "title": "Top-Panel Fabrication",
        "left": {
          "kind": "scar",
          "section": "supply-chain"
        },
        "media": [
          "metal-bends",
          "metal-bends_2"
        ],
        "mediaLabel": "Fabrication evidence from the recovery path"
      },
      {
        "key": "architecture",
        "parent": "failures",
        "eyebrow": "Decision 03",
        "title": "Quiet, Low-Profile Architecture",
        "left": {
          "kind": "scar",
          "section": "architecture"
        },
        "media": [
          "c24-render-01",
          "c24-render-02"
        ],
        "mediaLabel": "The low-profile system and external-supply architecture"
      },
      {
        "key": "serviceability",
        "parent": "failures",
        "eyebrow": "Decision 04",
        "title": "Field-Replaceable Headphone Jack",
        "left": {
          "kind": "scar",
          "section": "serviceability"
        },
        "media": [
          "eco-12993"
        ],
        "mediaLabel": "The change record behind the field repair"
      },
      {
        "key": "integration",
        "parent": "failures",
        "eyebrow": "Decision 05",
        "title": "Board-to-Mechanical Interfaces",
        "left": {
          "kind": "scar",
          "section": "integration"
        },
        "media": [
          "DCD_9150-55200-00_REV_12_Page_1",
          "DCD_9150-55200-00_REV_12_Page_1_REV-block"
        ],
        "mediaLabel": "The DCD as geometric contract"
      },
      {
        "key": "regulatory",
        "parent": "failures",
        "eyebrow": "Decision 06",
        "title": "Power-Supply Certification",
        "left": {
          "kind": "scar",
          "section": "regulatory"
        },
        "media": [
          "c24-render-02",
          "c24-prototype-03"
        ],
        "mediaLabel": "The console and its mechanical enclosure"
      },
      {
        "key": "components",
        "parent": "failures",
        "eyebrow": "Decision 07",
        "title": "Controls and Molded-Part Geometry",
        "left": {
          "kind": "scar",
          "section": "components"
        },
        "media": [
          "bournsem14page3",
          "forensic-1-1",
          "review-meter-artwork-0",
          "review-curtis-development-0"
        ],
        "mediaLabel": "Commodity components, custom geometry"
      },
      {
        "key": "governance",
        "parent": "governance",
        "eyebrow": "Control System",
        "title": "Production Acceptance and Release",
        "left": {
          "kind": "metrics",
          "keys": [
            "governance"
          ]
        },
        "media": [
          "DCD_9150-55200-00_REV_12_Page_1_REV-block",
          "ECO_12262_Page_1"
        ],
        "mediaLabel": "Release discipline made visible",
        "portalStudy": true
      },
      {
        "key": "impact",
        "parent": "impact",
        "eyebrow": "Outcomes",
        "title": "Results",
        "left": {
          "kind": "metrics",
          "keys": [
            "financial",
            "process",
            "governance"
          ]
        },
        "media": [
          "step-04-validation-report"
        ],
        "mediaLabel": "The original paint-process measurements"
      },
      {
        "key": "curation-12",
        "eyebrow": "C|24",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Sustaining the inspection definition"
      }
    ],
    "featured": [
      {
        "hero": true,
        "section": "product",
        "label": "The system",
        "detail": "Twenty-four faders and the audio front end in one low-profile console.",
        "layout": "system"
      },
      {
        "media": "step-03-method-a-fix",
        "section": "thermal",
        "label": "The intervention",
        "detail": "Vertical support reduced side-cap deformation during paint curing.",
        "layout": "intervention"
      },
      {
        "media": "DCD_9150-55200-00_REV_12_Page_1_REV-block",
        "section": "integration",
        "label": "The control record",
        "detail": "Twelve drawing revisions control the MicPre8 board interfaces.",
        "layout": "record"
      }
    ],
    "breakout": {
      "eyebrow": "Breakout composition · system → intervention → record",
      "description": "Prototype assemblies, supplier process photographs and released drawings show how the console took shape."
    }
  },
  "d-control": {
    "sections": {
      "architecture": "one-console-several-configurations",
      "stand": "the-stand-began-with-feature-tradeoffs",
      "assembly": "geometry-had-to-survive-assembly",
      "recovery": "recovering-the-manufacturing-process",
      "pcb": "prototype-board-containment",
      "sustaining": "sustaining-work-after-launch",
      "record": "what-the-record-establishes",
      "sources": "source-trail",
      "curation-8": "proposed-development-timeline",
      "curation-9": "undated-records"
    },
    "media": {
      "early": {
        "galleryId": "early",
        "src": "/assets/d-control/bubbles/02_early_id/PCll_Rendering.jpg"
      },
      "stand": {
        "galleryId": "stand",
        "src": "/assets/d-control/full-pass-247/stand-and-module.webp"
      },
      "main": {
        "galleryId": "main",
        "src": "/assets/d-control/full-pass-247/main-unit-assembly.webp"
      },
      "gaps": {
        "galleryId": "gaps",
        "src": "/assets/d-control/bubbles/03_gap_check/gap differences.jpg"
      },
      "molding": {
        "galleryId": "molding",
        "src": "/assets/d-control/bubbles/03_gap_check/moulding error.jpg"
      },
      "fit": {
        "galleryId": "fit",
        "src": "/assets/d-control/bubbles/04_stand_fit_check/Picture 037.jpg"
      },
      "installed": {
        "galleryId": "installed",
        "src": "/assets/d-control/bubbles/05_installations/D_Control_Music.jpg"
      },
      "review-foot-cover-0": {
        "galleryId": "review-foot-cover",
        "src": "/assets/d-control/curation-20260930/foot-cover-original-id.png"
      },
      "review-foot-cover-1": {
        "galleryId": "review-foot-cover",
        "src": "/assets/d-control/curation-20260930/foot-cover-extended-heel.png"
      },
      "review-a-crossbar-0": {
        "galleryId": "review-a-crossbar",
        "src": "/assets/d-control/curation-20260930/a-crossbar-assembly-reva.png"
      },
      "review-d-front-support-0": {
        "galleryId": "review-d-front-support",
        "src": "/assets/d-control/curation-20260930/d-front-pan-support-rev3.png"
      }
    },
    "scenes": [
      {
        "key": "architecture",
        "eyebrow": "System",
        "left": {
          "kind": "context"
        },
        "media": [
          "main"
        ]
      },
      {
        "key": "stand",
        "eyebrow": "Design choices",
        "left": {
          "kind": "none"
        },
        "media": [
          "stand",
          "early",
          "review-foot-cover-0",
          "review-foot-cover-1",
          "review-a-crossbar-0",
          "review-d-front-support-0"
        ]
      },
      {
        "key": "assembly",
        "eyebrow": "Alignment",
        "left": {
          "kind": "none"
        },
        "media": [
          "gaps",
          "fit"
        ]
      },
      {
        "key": "recovery",
        "eyebrow": "Manufacturing",
        "left": {
          "kind": "scar",
          "section": "recovery"
        },
        "media": []
      },
      {
        "key": "pcb",
        "parent": "recovery",
        "eyebrow": "Containment",
        "left": {
          "kind": "scar",
          "section": "pcb"
        },
        "media": []
      },
      {
        "key": "sustaining",
        "eyebrow": "After launch",
        "left": {
          "kind": "none"
        },
        "media": [
          "molding",
          "fit"
        ]
      },
      {
        "key": "record",
        "eyebrow": "Documented work",
        "left": {
          "kind": "context"
        },
        "media": [
          "installed"
        ]
      },
      {
        "key": "sources",
        "eyebrow": "Evidence",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-8",
        "eyebrow": "D-Control",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-9",
        "eyebrow": "D-Control",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "D-Control design and production",
      "description": "Early composition, assembly drawings, fit inspection and an installed system. Each image is captioned for the condition or design stage it documents."
    }
  },
  "d-command": {
    "sections": {
      "architecture": "a-compact-main-unit-with-room-to-expand",
      "reuse": "reuse-changed-the-machining-and-the-interfaces",
      "coating": "a-conductive-skin-that-still-let-the-buttons-move",
      "thermal": "testing-the-fanless-arrangement",
      "drawings": "drawings-were-an-integration-responsibility",
      "handoff": "compliance-and-the-production-handoff",
      "sources": "source-trail",
      "curation-7": "proposed-development-timeline",
      "curation-8": "optional-additional-context"
    },
    "media": {
      "product": {
        "galleryId": "product",
        "src": "/assets/d-command/bubbles/01_intro/D-CommandLarge.jpg"
      },
      "layout": {
        "galleryId": "layout",
        "src": "/assets/d-command/bubbles/02_architecture/danko_main_withlabels.png"
      },
      "assembly": {
        "galleryId": "assembly",
        "src": "/assets/d-command/full-pass-248/main-unit-open.webp"
      },
      "masking": {
        "galleryId": "masking",
        "src": "/assets/d-command/full-pass-248/main-panel-masking.webp"
      },
      "review-pcjr-fader-0": {
        "galleryId": "review-pcjr-fader",
        "src": "/assets/d-command/curation-20260930/pc2-jr-fader-rev6.png"
      }
    },
    "scenes": [
      {
        "key": "architecture",
        "eyebrow": "System",
        "left": {
          "kind": "context"
        },
        "media": [
          "product",
          "assembly"
        ]
      },
      {
        "key": "reuse",
        "eyebrow": "Interfaces",
        "left": {
          "kind": "none"
        },
        "media": [
          "layout",
          "review-pcjr-fader-0"
        ]
      },
      {
        "key": "coating",
        "eyebrow": "Conductive plastic",
        "left": {
          "kind": "scar",
          "section": "coating"
        },
        "media": [
          "masking"
        ]
      },
      {
        "key": "thermal",
        "eyebrow": "Airflow",
        "left": {
          "kind": "none"
        },
        "media": [
          "assembly"
        ]
      },
      {
        "key": "drawings",
        "eyebrow": "Release definition",
        "left": {
          "kind": "context"
        },
        "media": [
          "assembly"
        ]
      },
      {
        "key": "handoff",
        "eyebrow": "Production transfer",
        "left": {
          "kind": "metrics",
          "keys": [
            "governance"
          ]
        },
        "media": [
          "product"
        ]
      },
      {
        "key": "sources",
        "eyebrow": "Evidence",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-7",
        "eyebrow": "D-Command",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-8",
        "eyebrow": "D-Command",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Optional additional context"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "D-Command architecture and interfaces",
      "description": "The product configuration, early layout, main-unit assembly and retained masking detail. Captions identify each design stage and the limits of what the image establishes."
    }
  },
  "dv700": {
    "sections": {
      "diagnosis": "separate-the-complaint-from-the-failure",
      "testing": "make-the-test-earn-its-conclusion",
      "force": "more-grip-changed-the-alignment-problem",
      "assembly": "keep-assembly-from-moving-the-disc-path",
      "production": "carry-the-correction-into-production-work",
      "outcome": "what-the-work-established",
      "curation-6": "proposed-development-timeline"
    },
    "media": {
      "DV261-F01": {
        "galleryId": "full_pass_261_dv261-f01",
        "src": "/assets/dv700/full-pass-261/dv700-operation.jpg"
      },
      "DV261-F02": {
        "galleryId": "full_pass_261_dv261-f02",
        "src": "/assets/dv700/full-pass-261/roller-contamination.jpg"
      },
      "DV261-F03": {
        "galleryId": "full_pass_261_dv261-f03",
        "src": "/assets/dv700/full-pass-261/roller-support-study.jpg"
      },
      "DV261-F04": {
        "galleryId": "full_pass_261_dv261-f04",
        "src": "/assets/dv700/full-pass-261/carousel-inspection.jpg"
      }
    },
    "scenes": [
      {
        "key": "diagnosis",
        "parent": "diagnosis",
        "eyebrow": "DV700 investigation",
        "left": {
          "kind": "none"
        },
        "media": [
          "DV261-F01"
        ]
      },
      {
        "key": "testing",
        "parent": "testing",
        "eyebrow": "Test discipline",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "force",
        "parent": "force",
        "eyebrow": "Coupled mechanics",
        "left": {
          "kind": "none"
        },
        "media": [
          "DV261-F02",
          "DV261-F03"
        ]
      },
      {
        "key": "assembly",
        "parent": "assembly",
        "eyebrow": "Inspection and assembly",
        "left": {
          "kind": "none"
        },
        "media": [
          "DV261-F04"
        ]
      },
      {
        "key": "production",
        "parent": "production",
        "eyebrow": "Release preparation",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "outcome",
        "parent": "outcome",
        "eyebrow": "Documented results",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "curation-6",
        "eyebrow": "DV700 Disc Vault",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "A disc path is an assembly of interfaces",
      "description": "Product, contamination, corrective-design and inspection views support the DV700 sustaining account."
    }
  },
  "m700": {
    "sections": {
      "transport": "moving-a-disc-through-the-machine",
      "integration": "turning-the-mechanism-into-a-product",
      "molding": "a-carousel-that-had-to-fill-release-and-stay-flat",
      "recovery": "more-grip-changed-the-alignment-problem",
      "testing": "testing-what-the-complaint-actually-meant",
      "outcome": "what-the-work-established",
      "curation-6": "proposed-development-timeline"
    },
    "media": {
      "M260-F01": {
        "galleryId": "full_pass_260_m260-f01",
        "src": "/assets/m700/full-pass-260/breadboard-system.jpg"
      },
      "M260-F02": {
        "galleryId": "full_pass_260_m260-f02",
        "src": "/assets/m700/full-pass-260/sla-carousel.jpg"
      },
      "M260-F03": {
        "galleryId": "full_pass_260_m260-f03",
        "src": "/assets/m700/full-pass-260/prototype-bezel.jpg"
      },
      "M260-F04": {
        "galleryId": "full_pass_260_m260-f04",
        "src": "/assets/m700/full-pass-260/roller-support-design.jpg"
      },
      "M260-F05": {
        "galleryId": "full_pass_260_m260-f05",
        "src": "/assets/m700/full-pass-260/carousel-inspection.jpg"
      },
      "M260-F06": {
        "galleryId": "full_pass_260_m260-f06",
        "src": "/assets/m700/full-pass-260/roller-detail.jpg"
      }
    },
    "scenes": [
      {
        "key": "transport",
        "parent": "transport",
        "eyebrow": "Transport architecture",
        "left": {
          "kind": "none"
        },
        "media": [
          "M260-F01",
          "M260-F02"
        ]
      },
      {
        "key": "integration",
        "parent": "integration",
        "eyebrow": "Mechanical integration",
        "left": {
          "kind": "none"
        },
        "media": [
          "M260-F03"
        ]
      },
      {
        "key": "molding",
        "parent": "molding",
        "eyebrow": "Molding and inspection",
        "left": {
          "kind": "none"
        },
        "media": [
          "M260-F05"
        ]
      },
      {
        "key": "recovery",
        "parent": "recovery",
        "eyebrow": "Reliability development",
        "left": {
          "kind": "none"
        },
        "media": [
          "M260-F04",
          "M260-F06"
        ]
      },
      {
        "key": "testing",
        "parent": "testing",
        "eyebrow": "Tests and attribution",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "outcome",
        "parent": "outcome",
        "eyebrow": "Documented state",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "curation-6",
        "eyebrow": "M700 Disc Vault",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "From breadboard to continuing reliability work",
      "description": "Prototype, mechanism and inspection views explain the M700 account without claiming that a development rendering proves a shipped change."
    }
  },
  "ksystem-120": {
    "sections": {
      "product": "a-complete-system-in-a-compact-enclosure",
      "builds": "making-physical-builds-useful",
      "fit": "closing-the-base-to-cover-fit",
      "glow": "the-glow-was-a-mechanical-and-optical-interface",
      "factory": "defining-the-factorys-acceptance-criteria",
      "outcome": "product-outcome",
      "sources": "source-notes",
      "curation-7": "proposed-development-timeline",
      "curation-8": "undated-records"
    },
    "media": {
      "product-open": {
        "galleryId": "mechanical-evidence",
        "src": "/assets/ksystem-120/full-pass-244/product-open.webp"
      },
      "base-cover-stack": {
        "galleryId": "mechanical-evidence",
        "src": "/assets/ksystem-120/full-pass-244/base-cover-stack.webp"
      },
      "glow-comparison": {
        "galleryId": "mechanical-evidence",
        "src": "/assets/ksystem-120/full-pass-244/glow-comparison.webp"
      },
      "glow-section": {
        "galleryId": "mechanical-evidence",
        "src": "/assets/ksystem-120/full-pass-244/glow-section.webp"
      },
      "masked-panel": {
        "galleryId": "shop-process",
        "src": "/assets/ksystem-120/bubbles/01_hammered_lid/DSC05318.jpg"
      },
      "panel-fixture": {
        "galleryId": "shop-process",
        "src": "/assets/ksystem-120/bubbles/01_hammered_lid/DSC05404.jpg"
      }
    },
    "scenes": [
      {
        "key": "product",
        "eyebrow": "System architecture",
        "left": {
          "kind": "context"
        },
        "media": [
          "product-open"
        ]
      },
      {
        "key": "builds",
        "eyebrow": "Build and service interfaces",
        "left": {
          "kind": "none"
        },
        "media": [
          "product-open"
        ]
      },
      {
        "key": "fit",
        "eyebrow": "Tolerance decisions",
        "left": {
          "kind": "none"
        },
        "media": [
          "base-cover-stack"
        ]
      },
      {
        "key": "glow",
        "eyebrow": "Optical packaging",
        "left": {
          "kind": "none"
        },
        "media": [
          "glow-comparison",
          "glow-section"
        ]
      },
      {
        "key": "factory",
        "eyebrow": "Inspection and process",
        "left": {
          "kind": "metrics",
          "keys": [
            "process"
          ]
        },
        "media": [
          "masked-panel",
          "panel-fixture"
        ]
      },
      {
        "key": "outcome",
        "eyebrow": "Commercial product",
        "left": {
          "kind": "context"
        },
        "media": [
          "product-open"
        ]
      },
      {
        "key": "sources",
        "eyebrow": "Source record",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-7",
        "eyebrow": "KSYSTEM-120 / Orpheus",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-8",
        "eyebrow": "KSYSTEM-120 / Orpheus",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "breakout": {
      "eyebrow": "Orpheus engineering record",
      "description": "The product, interface studies and selected shop views. Captions distinguish design review, visual comparison and manufacturing context."
    },
    "featured": []
  },
  "sundance": {
    "sections": {
      "front": "a-front-that-had-to-open",
      "isolation": "isolation-changed-the-drive-constraint",
      "retention": "retention-and-connection-shared-a-tolerance-loop",
      "fit": "toolability-and-assembled-fit",
      "prototype": "making-the-prototype-build-assemble",
      "outcome": "from-detailed-design-into-production",
      "sources": "source-notes",
      "curation-7": "proposed-development-timeline",
      "curation-8": "undated-records"
    },
    "media": {
      "service-layout": {
        "galleryId": "service-layout",
        "src": "/assets/sundance/full-pass-245/front-service-schematic.svg"
      },
      "front-retention": {
        "galleryId": "interface-analysis",
        "src": "/assets/sundance/full-pass-245/front-retention.png"
      },
      "connector-section": {
        "galleryId": "interface-analysis",
        "src": "/assets/sundance/full-pass-245/connector-section.png"
      }
    },
    "scenes": [
      {
        "key": "front",
        "eyebrow": "System and service",
        "left": {
          "kind": "product"
        },
        "media": [
          "service-layout"
        ],
        "mediaLabel": "Requirements schematic"
      },
      {
        "key": "isolation",
        "eyebrow": "Contact and constraint",
        "left": {
          "kind": "scar",
          "section": "isolation"
        },
        "media": []
      },
      {
        "key": "retention",
        "eyebrow": "January review configuration",
        "left": {
          "kind": "none"
        },
        "media": [
          "front-retention",
          "connector-section"
        ],
        "mediaLabel": "Original analysis diagrams"
      },
      {
        "key": "fit",
        "eyebrow": "Supplier fit",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "prototype",
        "eyebrow": "Build configuration",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "outcome",
        "eyebrow": "Production disposition",
        "left": {
          "kind": "metrics",
          "keys": [
            "process",
            "governance"
          ]
        },
        "media": []
      },
      {
        "key": "sources",
        "eyebrow": "Source context",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-7",
        "eyebrow": "Sundance",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-8",
        "eyebrow": "Sundance",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "breakout": {
      "eyebrow": "Product context and interface analysis",
      "description": "The selected product-family photograph, a requirements schematic and two original workbook diagrams, with their distinct roles and attribution retained."
    },
    "featured": []
  },
  "morpheus": {
    "sections": {
      "reuse": "setting-the-reuse-boundary",
      "interfaces": "making-the-interfaces-work-together",
      "thermal": "sharing-layouts-with-the-thermal-design",
      "outcome": "what-the-study-established",
      "curation-4": "a-later-prototype-definition-record",
      "curation-5": "proposed-development-timeline",
      "curation-6": "optional-additional-context"
    },
    "media": {
      "M262-F01": {
        "galleryId": "full_pass_262_m262-f01",
        "src": "/assets/morpheus/full-pass-262/mechanical-exploded-view.png"
      },
      "M262-F02": {
        "galleryId": "full_pass_262_m262-f02",
        "src": "/assets/morpheus/full-pass-262/mechanical-requirements.png"
      },
      "M262-F03": {
        "galleryId": "full_pass_262_m262-f03",
        "src": "/assets/morpheus/full-pass-262/board-interface-layout.png"
      }
    },
    "scenes": [
      {
        "key": "reuse",
        "parent": "reuse",
        "eyebrow": "Mechanical definition",
        "left": {
          "kind": "none"
        },
        "media": [
          "M262-F01",
          "M262-F02"
        ]
      },
      {
        "key": "interfaces",
        "parent": "interfaces",
        "eyebrow": "Board and enclosure interfaces",
        "left": {
          "kind": "none"
        },
        "media": [
          "M262-F03"
        ]
      },
      {
        "key": "thermal",
        "parent": "thermal",
        "eyebrow": "Thermal collaboration",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "outcome",
        "parent": "outcome",
        "eyebrow": "Documented development state",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "curation-4",
        "eyebrow": "Morpheus",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "A later prototype-definition record"
      },
      {
        "key": "curation-5",
        "eyebrow": "Morpheus",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-6",
        "eyebrow": "Morpheus",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Optional additional context"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Morpheus mechanical study",
      "description": "Original brief drawings explain the proposed system, with baseline requirements, stretch choices and interfaces kept distinct from build and qualification outcomes."
    }
  },
  "kplayer-6000": {
    "sections": {
      "package": "a-new-player-inside-a-familiar-package",
      "door": "when-better-location-exposed-the-interference",
      "baffle": "the-air-dam-was-also-an-assembly-interface",
      "readiness": "checking-the-specifications-and-readiness",
      "support": "changes-continued-after-the-first-configuration",
      "legacy": "what-the-platform-made-reusable",
      "curation-6": "proposed-development-timeline"
    },
    "media": {
      "f01": {
        "galleryId": "full_pass_257_f01",
        "src": "/assets/kplayer-6000/full-pass-257/rear-interfaces.webp"
      },
      "f02": {
        "galleryId": "full_pass_257_f02",
        "src": "/assets/kplayer-6000/full-pass-257/front-door.webp"
      },
      "f03": {
        "galleryId": "full_pass_257_f03",
        "src": "/assets/kplayer-6000/full-pass-257/door-diagnostic-sequence.svg"
      }
    },
    "scenes": [
      {
        "key": "package",
        "eyebrow": "Product intent and envelope",
        "left": {
          "kind": "none"
        },
        "media": [
          "f01"
        ]
      },
      {
        "key": "door",
        "eyebrow": "Hinge location and spring force",
        "left": {
          "kind": "none"
        },
        "media": [
          "f02",
          "f03"
        ]
      },
      {
        "key": "baffle",
        "eyebrow": "Assembly and drawing revision",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "readiness",
        "eyebrow": "Specifications and manufacturing",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "support",
        "eyebrow": "Respin and customer integration",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "legacy",
        "eyebrow": "Reusable tooling",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "curation-6",
        "eyebrow": "KPLAYER-6000",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Product interfaces and the door investigation",
      "description": "Product views and a source-based sequence diagram connect the finished enclosure to the location, clearance and spring-force decisions."
    }
  },
  "kserver-1500": {
    "sections": {
      "product": "a-server-built-around-removable-storage",
      "mechanical": "keeping-the-drawing-and-the-built-part-aligned",
      "power": "a-replacement-power-supply-is-a-system-decision",
      "compute": "choosing-the-next-motherboard",
      "storage": "qualifying-drives-in-the-enclosure",
      "outcome": "what-the-record-establishes",
      "curation-6": "proposed-development-timeline"
    },
    "media": {
      "H258-F01": {
        "galleryId": "full_pass_258_h258-f01",
        "src": "/assets/kserver-1500/full-pass-258/server-closed.jpg"
      },
      "H258-F02": {
        "galleryId": "full_pass_258_h258-f02",
        "src": "/assets/kserver-1500/full-pass-258/server-cartridges.jpg"
      },
      "H258-F03": {
        "galleryId": "full_pass_258_h258-f03",
        "src": "/assets/kserver-1500/full-pass-258/disk-cartridge.jpg"
      }
    },
    "scenes": [
      {
        "key": "product",
        "parent": "product",
        "eyebrow": "Product and service access",
        "left": {
          "kind": "none"
        },
        "media": [
          "H258-F02"
        ]
      },
      {
        "key": "mechanical",
        "parent": "mechanical",
        "eyebrow": "Mechanical sustaining",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "power",
        "parent": "power",
        "eyebrow": "Power-supply evaluation",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "compute",
        "parent": "compute",
        "eyebrow": "Compute alternatives",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "storage",
        "parent": "storage",
        "eyebrow": "Storage qualification",
        "left": {
          "kind": "none"
        },
        "media": [
          "H258-F03"
        ]
      },
      {
        "key": "outcome",
        "parent": "outcome",
        "eyebrow": "Documented outcomes",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "curation-6",
        "eyebrow": "KSERVER-1500 1U Server",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Product form, removable storage and sustaining decisions",
      "description": "Archive product photographs show the enclosed server, its front-access storage and the removable disk cartridge."
    }
  },
  "kserver-5000": {
    "sections": {
      "package": "fourteen-drives-behind-the-front-door",
      "cooling": "a-cooler-choice-constrained-by-the-schedule",
      "adapter": "making-the-power-supply-adapter-explicit",
      "inspection": "checking-the-requirement-behind-an-apparent-defect",
      "validation": "qualification-remained-a-team-effort",
      "continuity": "keeping-drawings-aligned-with-production",
      "curation-6": "proposed-development-timeline"
    },
    "media": {
      "f01": {
        "galleryId": "full_pass_259_f01",
        "src": "/assets/kserver-5000/full-pass-259/fourteen-drive-access.webp"
      },
      "f02": {
        "galleryId": "full_pass_259_f02",
        "src": "/assets/kserver-5000/full-pass-259/door-hinge.webp"
      },
      "f03": {
        "galleryId": "full_pass_259_f03",
        "src": "/assets/kserver-5000/full-pass-259/internal-fan-layout.webp"
      },
      "f04": {
        "galleryId": "full_pass_259_f04",
        "src": "/assets/kserver-5000/full-pass-259/glow-section.webp"
      },
      "f05": {
        "galleryId": "full_pass_259_f05",
        "src": "/assets/kserver-5000/full-pass-259/fabrication-half-shears.webp"
      }
    },
    "scenes": [
      {
        "key": "package",
        "eyebrow": "Product package and inherited architecture",
        "left": {
          "kind": "none"
        },
        "media": [
          "f01",
          "f02",
          "f04"
        ]
      },
      {
        "key": "cooling",
        "eyebrow": "Cooling alternatives and evaluation",
        "left": {
          "kind": "none"
        },
        "media": [
          "f03"
        ]
      },
      {
        "key": "adapter",
        "eyebrow": "Model and fabrication drawing",
        "left": {
          "kind": "none"
        },
        "media": [
          "f05"
        ]
      },
      {
        "key": "inspection",
        "eyebrow": "Manufacturing clarification and open verification",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "validation",
        "eyebrow": "Electrical and drive-test boundaries",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "continuity",
        "eyebrow": "Supplier and drawing continuity",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "curation-6",
        "eyebrow": "KSERVER-5000",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "A familiar face, a dense package and a fabrication detail",
      "description": "Product photographs, an inherited assembly view and two drawing details connect the server package to its service and manufacturing interfaces."
    }
  },
  "kplayer-300": {
    "sections": {
      "designing-the-complete-player": "designing-the-complete-player",
      "openings-without-exposing-the-interior": "openings-without-exposing-the-interior",
      "a-continuous-shield-inside-a-plastic-enclosure": "a-continuous-shield-inside-a-plastic-enclosure",
      "tuning-the-blue-glow-and-isolating-the-fans": "tuning-the-blue-glow-and-isolating-the-fans",
      "reviewing-the-enclosure-as-a-system": "reviewing-the-enclosure-as-a-system",
      "power-supplies-and-the-rear-shield-interface": "power-supplies-and-the-rear-shield-interface",
      "changing-the-mounting-hardware": "changing-the-mounting-hardware",
      "testing-the-required-installation": "testing-the-required-installation",
      "from-kplayer-300-to-m300": "from-kplayer-300-to-m300",
      "curation-9": "proposed-development-timeline",
      "curation-10": "undated-records"
    },
    "media": {
      "KP269-F01": {
        "galleryId": "kplayer-architecture",
        "src": "/assets/kplayer-300/reviewed-design/kplayer-300-exploded-01-xl.webp"
      },
      "KP269-F02": {
        "galleryId": "kplayer-bezel",
        "src": "/assets/kplayer-300/product-and-installation/kplayer-300-detail-01-xl.webp"
      },
      "KP269-F03": {
        "galleryId": "kplayer-product",
        "src": "/assets/kplayer-300/product-and-installation/kplayer-300-detail-02-xl.webp"
      },
      "KP269-F04": {
        "galleryId": "kplayer-product",
        "src": "/assets/kplayer-300/product-and-installation/kplayer-300-detail-03-xl.webp"
      },
      "KP269-F05": {
        "galleryId": "kplayer-installation",
        "src": "/assets/kplayer-300/product-and-installation/kplayer-300-context-05-xl.webp"
      },
      "KP269-F06": {
        "galleryId": "kplayer-installation",
        "src": "/assets/kplayer-300/product-and-installation/kplayer-300-context-06-xl.webp"
      },
      "KP269-F07": {
        "galleryId": "kplayer-installation",
        "src": "/assets/kplayer-300/product-and-installation/kplayer-300-context-07-xl.webp"
      },
      "KP269-F08": {
        "galleryId": "kplayer-system",
        "src": "/assets/kplayer-300/product-and-installation/kplayer-300-context-04-md.webp"
      }
    },
    "scenes": [
      {
        "key": "designing-the-complete-player",
        "eyebrow": "Product development",
        "left": {
          "kind": "context"
        },
        "media": [
          "KP269-F03"
        ]
      },
      {
        "key": "openings-without-exposing-the-interior",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": [
          "KP269-F01"
        ]
      },
      {
        "key": "a-continuous-shield-inside-a-plastic-enclosure",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": [
          "KP269-F01"
        ]
      },
      {
        "key": "tuning-the-blue-glow-and-isolating-the-fans",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": [
          "KP269-F02"
        ]
      },
      {
        "key": "reviewing-the-enclosure-as-a-system",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "power-supplies-and-the-rear-shield-interface",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": [
          "KP269-F04"
        ]
      },
      {
        "key": "changing-the-mounting-hardware",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": [
          "KP269-F05"
        ]
      },
      {
        "key": "testing-the-required-installation",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": [
          "KP269-F06",
          "KP269-F07"
        ]
      },
      {
        "key": "from-kplayer-300-to-m300",
        "eyebrow": "Product development",
        "left": {
          "kind": "none"
        },
        "media": [
          "KP269-F03",
          "KP269-F08"
        ]
      },
      {
        "key": "curation-9",
        "eyebrow": "KPLAYER-300",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-10",
        "eyebrow": "KPLAYER-300",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Project views",
      "description": "Mechanical architecture, product details and installation views."
    }
  },
  "makeline": {
    "sections": {
      "architecture": "fit-the-food-path-and-the-service-spaces",
      "planning": "define-the-interfaces-before-the-build",
      "interfaces": "connect-the-mechanical-and-electrical-work",
      "validation": "plan-validation-across-the-line",
      "outcome": "documented-contribution",
      "curation-5": "proposed-development-timeline",
      "curation-6": "undated-records"
    },
    "media": {
      "D265-F01": {
        "galleryId": "full_pass_265_d265-f01",
        "src": "/assets/makeline/full-pass-265/makeline-row.jpg"
      },
      "D265-F02": {
        "galleryId": "full_pass_265_d265-f02",
        "src": "/assets/makeline/full-pass-265/module-cross-sections.jpg"
      },
      "D265-F03": {
        "galleryId": "full_pass_265_d265-f03",
        "src": "/assets/makeline/full-pass-265/integration-plan.jpg"
      },
      "D265-F04": {
        "galleryId": "full_pass_265_d265-f04",
        "src": "/assets/makeline/full-pass-265/motor-pcb-interface.jpg"
      },
      "D265-F05": {
        "galleryId": "full_pass_265_d265-f05",
        "src": "/assets/makeline/full-pass-265/ethercat-bridge-board.jpg"
      },
      "D265-F06": {
        "galleryId": "full_pass_265_d265-f06",
        "src": "/assets/makeline/full-pass-265/validation-plan.jpg"
      }
    },
    "models": [],
    "scenes": [
      {
        "key": "architecture",
        "parent": "architecture",
        "eyebrow": "System development",
        "title": "Fit the food path and the service spaces",
        "left": {
          "kind": "none"
        },
        "media": [
          "D265-F02"
        ],
        "mediaLabel": "Fit the food path and the service spaces"
      },
      {
        "key": "planning",
        "parent": "planning",
        "eyebrow": "System development",
        "title": "Define the interfaces before the build",
        "left": {
          "kind": "none"
        },
        "media": [
          "D265-F03",
          "D265-F04"
        ],
        "mediaLabel": "Define the interfaces before the build"
      },
      {
        "key": "interfaces",
        "parent": "interfaces",
        "eyebrow": "System development",
        "title": "Connect the mechanical and electrical work",
        "left": {
          "kind": "none"
        },
        "media": [
          "D265-F05"
        ],
        "mediaLabel": "Connect the mechanical and electrical work"
      },
      {
        "key": "validation",
        "parent": "validation",
        "eyebrow": "System development",
        "title": "Plan validation across the line",
        "left": {
          "kind": "none"
        },
        "media": [
          "D265-F06"
        ],
        "mediaLabel": "Plan validation across the line"
      },
      {
        "key": "outcome",
        "parent": "outcome",
        "eyebrow": "System development",
        "title": "Documented contribution",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": ""
      },
      {
        "key": "curation-5",
        "eyebrow": "Makeline",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-6",
        "eyebrow": "Makeline",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "featured": [
      {
        "media": "D265-F02",
        "section": "architecture",
        "label": "Food and service interfaces",
        "detail": "Architecture in the joint patent application.",
        "layout": "intervention"
      },
      {
        "media": "D265-F06",
        "section": "validation",
        "label": "System validation plan",
        "detail": "Reliability, safety and fault handling.",
        "layout": "record"
      }
    ],
    "breakout": {
      "eyebrow": "Food path, interfaces and validation",
      "description": "An assembled cabinet line, mechanical interface drawing, board and planning records connect the system architecture to its physical development."
    }
  },
  "dispensers": {
    "sections": {
      "alternatives": "move-the-food-then-control-the-release",
      "tests": "make-the-path-visible",
      "cleaning": "design-for-removal-and-cleaning",
      "outcomes": "what-the-prototypes-establish",
      "curation-4": "proposed-development-timeline",
      "curation-5": "additional-context"
    },
    "media": {
      "D264-F01": {
        "galleryId": "full_pass_264_d264-f01",
        "src": "/assets/dispensers/full-pass-264/six-chute-prototype.jpg"
      },
      "D264-F02": {
        "galleryId": "full_pass_264_d264-f02",
        "src": "/assets/dispensers/full-pass-264/mechanism-alternatives.jpg"
      },
      "D264-F03": {
        "galleryId": "full_pass_264_d264-f03",
        "src": "/assets/dispensers/full-pass-264/outlet-drive-options.jpg"
      },
      "D264-F04": {
        "galleryId": "full_pass_264_d264-f04",
        "src": "/assets/dispensers/full-pass-264/cheese-chute-test.jpg"
      },
      "D264-F05": {
        "galleryId": "full_pass_264_d264-f05",
        "src": "/assets/dispensers/full-pass-264/beans-chute-test.jpg"
      },
      "D264-F06": {
        "galleryId": "full_pass_264_d264-f06",
        "src": "/assets/dispensers/full-pass-264/removable-parts.jpg"
      }
    },
    "models": [],
    "scenes": [
      {
        "key": "alternatives",
        "parent": "alternatives",
        "eyebrow": "Mechanism studies",
        "title": "Move the food, then control the release",
        "left": {
          "kind": "none"
        },
        "media": [
          "D264-F02",
          "D264-F03"
        ],
        "mediaLabel": "Concept choices and outlet drive options"
      },
      {
        "key": "tests",
        "parent": "tests",
        "eyebrow": "Physical prototypes",
        "title": "Make the path visible",
        "left": {
          "kind": "none"
        },
        "media": [
          "D264-F04",
          "D264-F05"
        ],
        "mediaLabel": "Clear ingredient paths"
      },
      {
        "key": "cleaning",
        "parent": "cleaning",
        "eyebrow": "Service access",
        "title": "Design for removal and cleaning",
        "left": {
          "kind": "none"
        },
        "media": [
          "D264-F06"
        ],
        "mediaLabel": "Separated food-contact parts"
      },
      {
        "key": "outcomes",
        "parent": "outcomes",
        "eyebrow": "Evidence and contribution",
        "title": "What the prototypes establish",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": ""
      },
      {
        "key": "curation-4",
        "eyebrow": "Ingredient Dispensers",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-5",
        "eyebrow": "Ingredient Dispensers",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Additional context"
      }
    ],
    "featured": [
      {
        "media": "D264-F03",
        "section": "alternatives",
        "label": "Separate motion and release",
        "detail": "The drive alternatives under consideration.",
        "layout": "intervention"
      },
      {
        "media": "D264-F04",
        "section": "tests",
        "label": "See the food path",
        "detail": "A clear chute test setup.",
        "layout": "record"
      }
    ],
    "breakout": {
      "eyebrow": "Mechanisms and physical prototypes",
      "description": "Concept sheets, ingredient-present setups and separated parts show the dispenser interfaces at different stages of development."
    }
  },
  "backsplash": {
    "sections": {
      "packaging": "power-and-controls-in-the-cabinet",
      "display": "one-display-assembly-across-the-modules",
      "grid": "the-mounting-grid-was-an-interface",
      "geometry": "defining-the-optical-and-board-geometry",
      "access": "sealing-and-access-around-the-package",
      "hardware": "the-hardware-record",
      "sources": "source-trail",
      "curation-7": "proposed-development-timeline",
      "curation-8": "undated-records"
    },
    "media": {
      "package": {
        "galleryId": "full_pass_255_m05",
        "src": "/assets/backsplash/bubbles/01_misc/IMG_0238_60.png"
      },
      "front": {
        "galleryId": "full_pass_255_m01",
        "src": "/assets/backsplash/bubbles/01_misc/PXL_20211102_214847653_60.png"
      },
      "grid": {
        "galleryId": "full_pass_255_m03",
        "src": "/assets/backsplash/bubbles/01_misc/PXL_20211102_190316482_60.png"
      },
      "ring": {
        "galleryId": "full_pass_255_m02",
        "src": "/assets/backsplash/full-pass-255/light-ring-detail.png"
      },
      "bench": {
        "galleryId": "full_pass_255_m04",
        "src": "/assets/backsplash/bubbles/01_misc/PXL_20211102_180108511_60.png"
      }
    },
    "scenes": [
      {
        "key": "packaging",
        "eyebrow": "Cabinet integration",
        "left": {
          "kind": "context"
        },
        "media": [
          "package"
        ]
      },
      {
        "key": "display",
        "eyebrow": "Repeated interface",
        "left": {
          "kind": "none"
        },
        "media": [
          "front"
        ]
      },
      {
        "key": "grid",
        "eyebrow": "Mechanical interface",
        "left": {
          "kind": "none"
        },
        "media": [
          "grid"
        ]
      },
      {
        "key": "geometry",
        "eyebrow": "Drawing definition",
        "left": {
          "kind": "none"
        },
        "media": [
          "ring"
        ]
      },
      {
        "key": "access",
        "eyebrow": "Enclosure interfaces",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "hardware",
        "eyebrow": "Physical assembly",
        "left": {
          "kind": "none"
        },
        "media": [
          "bench"
        ]
      },
      {
        "key": "sources",
        "eyebrow": "Source context",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-7",
        "eyebrow": "Backsplash / Infrastructure Slot",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-8",
        "eyebrow": "Backsplash / Infrastructure Slot",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Cabinet electronics and mechanical interfaces",
      "description": "The retained interior, display-array, mounting-grid, light-ring and bench views connect the subsystem package to its mechanical details."
    }
  },
  "portion-cup": {
    "sections": {
      "denesting": "separate-the-nested-cups",
      "interfaces": "fit-the-interfaces-around-the-stack",
      "development": "move-from-parts-planning-to-assembly",
      "outcome": "the-roadmap-decision",
      "curation-4": "proposed-development-timeline",
      "curation-5": "undated-records"
    },
    "media": {
      "D266-F01": {
        "galleryId": "full_pass_266_d266-f01",
        "src": "/assets/portion-cup/full-pass-266/four-channel-row.jpg"
      },
      "D266-F02": {
        "galleryId": "full_pass_266_d266-f02",
        "src": "/assets/portion-cup/full-pass-266/cup-rim-section.jpg"
      },
      "D266-F03": {
        "galleryId": "full_pass_266_d266-f03",
        "src": "/assets/portion-cup/full-pass-266/ring-gear-drive.jpg"
      },
      "D266-F04": {
        "galleryId": "full_pass_266_d266-f04",
        "src": "/assets/portion-cup/full-pass-266/board-packaging-study.jpg"
      },
      "D266-F05": {
        "galleryId": "full_pass_266_d266-f05",
        "src": "/assets/portion-cup/full-pass-266/cabinet-layout.jpg"
      },
      "D266-F06": {
        "galleryId": "full_pass_266_d266-f06",
        "src": "/assets/portion-cup/full-pass-266/drive-assembly.jpg"
      }
    },
    "models": [],
    "scenes": [
      {
        "key": "denesting",
        "parent": "denesting",
        "eyebrow": "Cup-denesting development",
        "title": "Separate the nested cups",
        "left": {
          "kind": "none"
        },
        "media": [
          "D266-F02",
          "D266-F03"
        ],
        "mediaLabel": "Separate the nested cups"
      },
      {
        "key": "interfaces",
        "parent": "interfaces",
        "eyebrow": "Cup-denesting development",
        "title": "Fit the interfaces around the stack",
        "left": {
          "kind": "none"
        },
        "media": [
          "D266-F04",
          "D266-F05"
        ],
        "mediaLabel": "Fit the interfaces around the stack"
      },
      {
        "key": "development",
        "parent": "development",
        "eyebrow": "Cup-denesting development",
        "title": "Move from parts planning to assembly",
        "left": {
          "kind": "none"
        },
        "media": [
          "D266-F06"
        ],
        "mediaLabel": "Move from parts planning to assembly"
      },
      {
        "key": "outcome",
        "parent": "outcome",
        "eyebrow": "Cup-denesting development",
        "title": "The roadmap decision",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": ""
      },
      {
        "key": "curation-4",
        "eyebrow": "Portion Cup",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-5",
        "eyebrow": "Portion Cup",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "featured": [
      {
        "media": "D266-F04",
        "section": "interfaces",
        "label": "Packaging tradeoffs",
        "detail": "Boards, connectors and wire space around the cup stacks.",
        "layout": "intervention"
      },
      {
        "media": "D266-F06",
        "section": "development",
        "label": "Physical assembly",
        "detail": "Machined enclosure, bearings and pinions.",
        "layout": "record"
      }
    ],
    "breakout": {
      "eyebrow": "Cup rims, drive and packaging",
      "description": "CAD sections, an annotated board study and physical assembly show how the denesting mechanism and its interfaces fit together."
    }
  },
  "webtv-galaxy": {
    "sections": {
      "architecture": "a-gateway-for-a-planned-home-network",
      "thermal": "heat-set-the-route-through-the-enclosure",
      "partition": "drive-support-and-air-partitioning-needed-different-parts",
      "cpu": "the-cpu-package-had-to-be-assembled-in-place",
      "manufacture": "tooling-feedback-changed-the-geometry-under-discussion",
      "outcome": "from-prototype-files-to-the-last-recorded-review",
      "sources": "source-trail",
      "curation-7": "proposed-development-timeline"
    },
    "media": {
      "architecture": {
        "galleryId": "architecture",
        "src": "/assets/webtv-galaxy/full-pass-252/architecture.webp"
      },
      "early-appearance": {
        "galleryId": "architecture",
        "src": "/assets/webtv-galaxy/full-pass-252/early-appearance.webp"
      },
      "thermal-temperature": {
        "galleryId": "thermal",
        "src": "/assets/webtv-galaxy/full-pass-252/thermal-temperature.webp"
      },
      "thermal-velocity": {
        "galleryId": "thermal",
        "src": "/assets/webtv-galaxy/full-pass-252/thermal-velocity.webp"
      },
      "cpu-top": {
        "galleryId": "cpu",
        "src": "/assets/webtv-galaxy/full-pass-252/cpu-top.webp"
      },
      "cpu-underside": {
        "galleryId": "cpu",
        "src": "/assets/webtv-galaxy/full-pass-252/cpu-underside.webp"
      },
      "base-prototype-deviations": {
        "galleryId": "manufacture",
        "src": "/assets/webtv-galaxy/full-pass-252/base-prototype-deviations.webp"
      }
    },
    "scenes": [
      {
        "key": "architecture",
        "eyebrow": "System architecture",
        "left": {
          "kind": "context"
        },
        "media": [
          "architecture",
          "early-appearance"
        ]
      },
      {
        "key": "thermal",
        "eyebrow": "Thermal analysis",
        "left": {
          "kind": "none"
        },
        "media": [
          "thermal-temperature",
          "thermal-velocity"
        ]
      },
      {
        "key": "partition",
        "eyebrow": "Separate functions",
        "left": {
          "kind": "none"
        },
        "media": [
          "architecture"
        ]
      },
      {
        "key": "cpu",
        "eyebrow": "Assembly sequence",
        "left": {
          "kind": "scar",
          "section": "cpu"
        },
        "media": [
          "cpu-top",
          "cpu-underside"
        ]
      },
      {
        "key": "manufacture",
        "eyebrow": "Supplier feedback",
        "left": {
          "kind": "none"
        },
        "media": [
          "base-prototype-deviations"
        ]
      },
      {
        "key": "outcome",
        "eyebrow": "Prototype milestones",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "sources",
        "eyebrow": "Evidence",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-7",
        "eyebrow": "WebTV Galaxy",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Inside the development package",
      "description": "The assembly views, thermal plots and annotated base drawing explain the mechanical decisions. An early appearance study preserves the exterior direction separately from the development chassis."
    }
  },
  "webtv-cortez": {
    "sections": {
      "envelope": "a-rectangular-mechanism-inside-an-organic-shell",
      "keys": "choosing-the-keys-while-the-envelope-was-still-moving",
      "model": "a-working-model-to-check-the-design",
      "review": "the-first-review-changed-the-surfaces",
      "outcome": "prototype-release-and-the-later-data-exchange",
      "people": "people-and-responsibilities",
      "sources": "source-trail",
      "curation-7": "proposed-development-timeline"
    },
    "media": {
      "working-layout": {
        "galleryId": "keys",
        "src": "/assets/webtv-cortez/full-pass-253/working-layout.webp"
      },
      "supplier-key-envelope": {
        "galleryId": "keys",
        "src": "/assets/webtv-cortez/full-pass-253/supplier-key-envelope.webp"
      },
      "keycap-section": {
        "galleryId": "keys",
        "src": "/assets/webtv-cortez/full-pass-253/keycap-section.webp"
      },
      "underside-surface": {
        "galleryId": "surfaces",
        "src": "/assets/webtv-cortez/full-pass-253/underside-surface.webp"
      },
      "grip-study": {
        "galleryId": "surfaces",
        "src": "/assets/webtv-cortez/full-pass-253/grip-study.webp"
      },
      "navigation-detail": {
        "galleryId": "prototype",
        "src": "/assets/webtv-cortez/full-pass-253/navigation-detail.webp"
      }
    },
    "scenes": [
      {
        "key": "envelope",
        "eyebrow": "Surface development",
        "left": {
          "kind": "none"
        },
        "media": [
          "underside-surface",
          "grip-study"
        ]
      },
      {
        "key": "keys",
        "eyebrow": "Supplier interfaces",
        "left": {
          "kind": "none"
        },
        "media": [
          "working-layout",
          "supplier-key-envelope",
          "keycap-section"
        ]
      },
      {
        "key": "model",
        "eyebrow": "A working hard model",
        "left": {
          "kind": "none"
        },
        "media": [
          "working-layout"
        ]
      },
      {
        "key": "review",
        "eyebrow": "Review and revision",
        "left": {
          "kind": "none"
        },
        "media": [
          "underside-surface"
        ]
      },
      {
        "key": "outcome",
        "eyebrow": "Prototype and handoff",
        "left": {
          "kind": "none"
        },
        "media": [
          "navigation-detail"
        ]
      },
      {
        "key": "people",
        "eyebrow": "Responsibilities",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "sources",
        "eyebrow": "Evidence",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-7",
        "eyebrow": "Cortez",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "From the layout to the handgrip",
      "description": "The working drawing, supplier references and surface studies explain the package. The photograph records the interface without asserting a prototype revision."
    }
  },
  "webtv-elmer": {
    "sections": {
      "interfaces": "establishing-the-interfaces",
      "elmer": "reworking-the-elmer-hardware",
      "zeus": "turning-elmer-into-zeus",
      "connector": "connector-identity-drove-the-rear-boundary",
      "perforations": "reviewing-contact-area-and-perforations",
      "fabrication": "from-geometry-to-fabricated-parts",
      "assembly": "assembly-still-had-open-details",
      "people": "people-and-responsibilities",
      "sources": "source-trail",
      "curation-9": "proposed-development-timeline"
    },
    "media": {
      "worksheet": {
        "galleryId": "reference",
        "src": "/assets/webtv-elmer/full-pass-254/mercury-interface-worksheet.webp"
      },
      "exception": {
        "galleryId": "reference",
        "src": "/assets/webtv-elmer/full-pass-254/power-supply-exception.webp"
      },
      "connector": {
        "galleryId": "connector",
        "src": "/assets/webtv-elmer/full-pass-254/stacked-dsub.webp"
      },
      "review": {
        "galleryId": "review",
        "src": "/assets/webtv-elmer/full-pass-254/perforation-review.webp"
      }
    },
    "scenes": [
      {
        "key": "interfaces",
        "eyebrow": "Component inputs",
        "left": {
          "kind": "metrics",
          "keys": [
            "governance"
          ]
        },
        "media": [
          "worksheet",
          "exception"
        ]
      },
      {
        "key": "elmer",
        "eyebrow": "Prototype revisions",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "zeus",
        "eyebrow": "Enclosure conversion",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "connector",
        "eyebrow": "Connector definition",
        "left": {
          "kind": "none"
        },
        "media": [
          "connector"
        ]
      },
      {
        "key": "perforations",
        "eyebrow": "Thermal review",
        "left": {
          "kind": "none"
        },
        "media": [
          "review"
        ]
      },
      {
        "key": "fabrication",
        "eyebrow": "Supplier release and receipt",
        "left": {
          "kind": "metrics",
          "keys": [
            "process"
          ]
        },
        "media": []
      },
      {
        "key": "assembly",
        "eyebrow": "Assembly support",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "people",
        "eyebrow": "Contribution boundaries",
        "left": {
          "kind": "context"
        },
        "media": []
      },
      {
        "key": "sources",
        "eyebrow": "Source context",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-9",
        "eyebrow": "Elmer / Zeus (HomeNet)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Interfaces and enclosure review",
      "description": "The original component worksheet, corrected connector reference and annotated perforation layout show the mechanical decisions. Captions distinguish reference parts, review instructions and unverified outcomes."
    }
  },
  "bazooka": {
    "sections": {
      "architecture": "a-small-enclosure-with-several-jobs",
      "airgap": "giving-the-air-gap-mechanism-a-controlled-reference",
      "fit": "retention-without-an-over-constrained-fit",
      "testing": "testing-the-complete-interface",
      "handoff": "making-the-supplier-handoff-inspectable",
      "factory": "following-the-part-through-the-factory",
      "sources": "source-trail",
      "curation-7": "proposed-development-timeline",
      "curation-8": "optional-additional-context"
    },
    "media": {
      "airgap": {
        "galleryId": "airgap",
        "src": "/assets/bazooka/full-pass-249/airgap-guide.webp"
      },
      "springs": {
        "galleryId": "airgap",
        "src": "/assets/bazooka/03-base-test-btn-2/IMG_20170928_153842-2-xl.webp"
      },
      "tabs": {
        "galleryId": "fit",
        "src": "/assets/bazooka/full-pass-249/fit-tabs.webp"
      },
      "chamfer": {
        "galleryId": "fit",
        "src": "/assets/bazooka/full-pass-249/fit-chamfer.webp"
      },
      "click": {
        "galleryId": "qualification",
        "src": "/assets/bazooka/03-base-click-testing-1/IMG_20170419_135715-lg.webp"
      },
      "pull": {
        "galleryId": "qualification",
        "src": "/assets/bazooka/03-base-side-pull-testing/IMG_20170420_173231-xl.webp"
      },
      "tooling": {
        "galleryId": "factory",
        "src": "/assets/bazooka/03-base-test-btn-1/IMG_20170830_103733-xl.webp"
      },
      "samples": {
        "galleryId": "factory",
        "src": "/assets/bazooka/03-base-test-btn-2/IMG_20170904_151956-xl.webp"
      }
    },
    "scenes": [
      {
        "key": "architecture",
        "eyebrow": "System",
        "left": {
          "kind": "context"
        },
        "media": []
      },
      {
        "key": "airgap",
        "eyebrow": "Switch mechanism",
        "left": {
          "kind": "none"
        },
        "media": [
          "airgap",
          "springs"
        ]
      },
      {
        "key": "fit",
        "eyebrow": "Locating and retaining",
        "left": {
          "kind": "metrics",
          "keys": [
            "process"
          ]
        },
        "media": [
          "tabs",
          "chamfer"
        ]
      },
      {
        "key": "testing",
        "eyebrow": "Qualification",
        "left": {
          "kind": "scar",
          "section": "testing"
        },
        "media": [
          "click",
          "pull"
        ]
      },
      {
        "key": "handoff",
        "eyebrow": "Engineering data",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "factory",
        "eyebrow": "Manufacturing",
        "left": {
          "kind": "none"
        },
        "media": [
          "tooling",
          "samples"
        ]
      },
      {
        "key": "sources",
        "eyebrow": "Evidence",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-7",
        "eyebrow": "Bazooka (Base Station)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-8",
        "eyebrow": "Bazooka (Base Station)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Optional additional context"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Mechanism, fit and factory work",
      "description": "The April proposal and attributed fit diagrams sit alongside dated test setups, tooling and samples. Each caption identifies the stage and what the image establishes."
    }
  },
  "room-director": {
    "sections": {
      "architecture": "a-glass-surface-with-a-mechanical-job",
      "housing": "retaining-the-housing-while-clearing-the-display",
      "bonding": "bonding-required-a-controlled-assembly-process",
      "inspection": "defining-the-surface-and-how-to-inspect-it",
      "label": "a-shared-label-problem-with-several-possible-fixes",
      "testing": "what-the-complete-device-tests-demonstrated",
      "outcome": "engineering-the-interfaces-through-the-handoff",
      "sources": "source-trail",
      "curation-8": "proposed-development-timeline",
      "curation-9": "undated-records",
      "curation-10": "optional-additional-context"
    },
    "media": {
      "product": {
        "galleryId": "architecture",
        "src": "/assets/room-director/full-pass-250/product-render.webp"
      },
      "assembly": {
        "galleryId": "architecture",
        "src": "/assets/room-director/full-pass-250/touch-assembly.webp"
      },
      "hinge": {
        "galleryId": "housing",
        "src": "/assets/room-director/full-pass-250/hinge-change.webp"
      },
      "clearance": {
        "galleryId": "housing",
        "src": "/assets/room-director/full-pass-250/display-clearance.webp"
      },
      "glue": {
        "galleryId": "bonding",
        "src": "/assets/room-director/full-pass-250/glue-process.webp"
      },
      "clamp": {
        "galleryId": "bonding",
        "src": "/assets/room-director/full-pass-250/clamp-process.webp"
      },
      "appearance": {
        "galleryId": "inspection",
        "src": "/assets/room-director/full-pass-250/glass-appearance.webp"
      },
      "drop": {
        "galleryId": "inspection",
        "src": "/assets/room-director/full-pass-250/drop-fixture.webp"
      }
    },
    "scenes": [
      {
        "key": "architecture",
        "eyebrow": "Glass and display",
        "left": {
          "kind": "context"
        },
        "media": [
          "assembly"
        ]
      },
      {
        "key": "housing",
        "eyebrow": "Mechanical engagement",
        "left": {
          "kind": "none"
        },
        "media": [
          "hinge",
          "clearance"
        ]
      },
      {
        "key": "bonding",
        "eyebrow": "Factory process",
        "left": {
          "kind": "metrics",
          "keys": [
            "process"
          ]
        },
        "media": [
          "glue",
          "clamp"
        ]
      },
      {
        "key": "inspection",
        "eyebrow": "Supplier definition",
        "left": {
          "kind": "none"
        },
        "media": [
          "appearance"
        ]
      },
      {
        "key": "label",
        "eyebrow": "Alternatives",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "testing",
        "eyebrow": "Reliability",
        "left": {
          "kind": "scar",
          "section": "testing"
        },
        "media": [
          "drop"
        ]
      },
      {
        "key": "outcome",
        "eyebrow": "Contribution",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "sources",
        "eyebrow": "Evidence",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-8",
        "eyebrow": "Room Director (Sativa)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-9",
        "eyebrow": "Room Director (Sativa)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      },
      {
        "key": "curation-10",
        "eyebrow": "Room Director (Sativa)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Optional additional context"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Glass, assembly and test evidence",
      "description": "The product render introduces the form. Dated geometry, assembly and appearance figures explain how the interfaces were defined; the drop-fixture photographs show physical testing. Captions retain each source's stage and scope."
    }
  },
  "wall-plates": {
    "sections": {
      "architecture": "a-clean-face-with-a-mechanical-job",
      "manufacture": "making-the-chassis-manufacturable",
      "engagement": "the-cover-could-enter-and-still-come-loose",
      "seating": "seating-required-its-own-controlled-surfaces",
      "retention": "retaining-the-module-behind-the-plate",
      "finish": "a-white-surface-still-had-to-survive-handling",
      "outcome": "what-this-work-established",
      "sources": "source-trail",
      "curation-8": "proposed-development-timeline",
      "curation-9": "undated-records",
      "curation-10": "optional-additional-context"
    },
    "media": {
      "cover": {
        "galleryId": "product",
        "src": "/assets/wall-plates/full-pass-251/cover-render.webp"
      },
      "chassis": {
        "galleryId": "product",
        "src": "/assets/wall-plates/full-pass-251/chassis-render.webp"
      },
      "hook": {
        "galleryId": "manufacture",
        "src": "/assets/wall-plates/full-pass-251/hook-dfm.webp"
      },
      "y": {
        "galleryId": "manufacture",
        "src": "/assets/wall-plates/full-pass-251/y-engagement.webp"
      },
      "z": {
        "galleryId": "seating",
        "src": "/assets/wall-plates/full-pass-251/z-seating.webp"
      },
      "evt2": {
        "galleryId": "testing",
        "src": "/assets/wall-plates/full-pass-251/evt2-hardness.webp"
      },
      "dvt": {
        "galleryId": "testing",
        "src": "/assets/wall-plates/full-pass-251/dvt-hardness.webp"
      },
      "film": {
        "galleryId": "testing",
        "src": "/assets/wall-plates/full-pass-251/protective-film.webp"
      }
    },
    "scenes": [
      {
        "key": "architecture",
        "eyebrow": "Product architecture",
        "left": {
          "kind": "context"
        },
        "media": [
          "chassis"
        ]
      },
      {
        "key": "manufacture",
        "eyebrow": "Stamping constraints",
        "left": {
          "kind": "none"
        },
        "media": [
          "hook"
        ]
      },
      {
        "key": "engagement",
        "eyebrow": "Moving interfaces",
        "left": {
          "kind": "scar",
          "section": "engagement"
        },
        "media": [
          "y"
        ]
      },
      {
        "key": "seating",
        "eyebrow": "Drawing control",
        "left": {
          "kind": "none"
        },
        "media": [
          "z"
        ]
      },
      {
        "key": "retention",
        "eyebrow": "System retention",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "finish",
        "eyebrow": "Appearance and test",
        "left": {
          "kind": "none"
        },
        "media": [
          "evt2",
          "dvt",
          "film"
        ]
      },
      {
        "key": "outcome",
        "eyebrow": "Contribution",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "sources",
        "eyebrow": "Evidence",
        "left": {
          "kind": "sources"
        },
        "media": []
      },
      {
        "key": "curation-8",
        "eyebrow": "Wall Plate (Waldo)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-9",
        "eyebrow": "Wall Plate (Waldo)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      },
      {
        "key": "curation-10",
        "eyebrow": "Wall Plate (Waldo)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Optional additional context"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "From form to physical samples",
      "description": "Original cover and chassis renders introduce the product. Supplier and fit diagrams explain the mechanical decisions; sample tables and photographs preserve the distinct finish-test results."
    }
  },
  "extension-switches": {
    "sections": {
      "mechanism": "a-familiar-switch-with-a-coupled-mechanism",
      "bonding": "holding-the-cap-meant-controlling-the-process",
      "feel": "the-feel-depended-on-the-hidden-stack",
      "testing": "test-requirements-and-test-results-had-different-jobs",
      "definition": "turning-findings-into-inspectable-parts",
      "outcome": "what-the-work-established",
      "curation-6": "proposed-development-timeline",
      "curation-7": "undated-records",
      "curation-8": "optional-additional-context"
    },
    "media": {
      "E263-F01": {
        "galleryId": "full_pass_263_e263-f01",
        "src": "/assets/extension-switches/full-pass-263/cap-fixture.jpg"
      },
      "E263-F02": {
        "galleryId": "full_pass_263_e263-f02",
        "src": "/assets/extension-switches/full-pass-263/cap-placement.jpg"
      },
      "E263-F03": {
        "galleryId": "full_pass_263_e263-f03",
        "src": "/assets/extension-switches/full-pass-263/switch-test-rig.webp"
      }
    },
    "scenes": [
      {
        "key": "mechanism",
        "parent": "mechanism",
        "eyebrow": "Coupled mechanism",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "bonding",
        "parent": "bonding",
        "eyebrow": "Cap bonding",
        "left": {
          "kind": "none"
        },
        "media": [
          "E263-F01",
          "E263-F02"
        ]
      },
      {
        "key": "feel",
        "parent": "feel",
        "eyebrow": "Operating feel",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "testing",
        "parent": "testing",
        "eyebrow": "Reliability development",
        "left": {
          "kind": "none"
        },
        "media": [
          "E263-F03"
        ]
      },
      {
        "key": "definition",
        "parent": "definition",
        "eyebrow": "Part and process definition",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "outcome",
        "parent": "outcome",
        "eyebrow": "Documented contribution",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "curation-6",
        "eyebrow": "Extension Switch (Elvis)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-7",
        "eyebrow": "Extension Switch (Elvis)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      },
      {
        "key": "curation-8",
        "eyebrow": "Extension Switch (Elvis)",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Optional additional context"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Assembly and test views",
      "description": "The cap fixture, cap placement and switch test rig show the physical work behind the Extension Switch account."
    }
  },
  "fissler-bbq": {
    "sections": {
      "brief": "the-brief-and-my-role",
      "experiments": "making-the-brief-testable",
      "mechanism": "driving-the-cage-from-its-edge",
      "tests": "separating-heat-rotation-and-cooking",
      "results": "results-and-decisions",
      "ending": "where-my-involvement-ended",
      "gallery": "project-views",
      "curation-7": "proposed-development-timeline",
      "curation-8": "undated-records"
    },
    "media": {
      "d268-f01": {
        "galleryId": "fissler-project-views",
        "src": "/assets/fissler-bbq/selected-general/fissler-context-01-xl.webp"
      },
      "d268-f02": {
        "galleryId": "fissler-project-views",
        "src": "/assets/fissler-bbq/selected-general/fissler-context-02-xl.webp"
      },
      "d268-f03": {
        "galleryId": "fissler-project-views",
        "src": "/assets/fissler-bbq/selected-general/fissler-context-03-xl.webp"
      }
    },
    "models": [],
    "scenes": [
      {
        "key": "brief",
        "parent": "brief",
        "eyebrow": "Context",
        "title": "The brief and my role",
        "left": {
          "kind": "context"
        },
        "media": [
          "d268-f02"
        ],
        "mediaLabel": "Upright project view"
      },
      {
        "key": "experiments",
        "parent": "experiments",
        "eyebrow": "Experiments",
        "title": "Making the brief testable",
        "left": {
          "kind": "none"
        },
        "media": [
          "d268-f03"
        ],
        "mediaLabel": "Opened-flat configuration"
      },
      {
        "key": "mechanism",
        "parent": "mechanism",
        "eyebrow": "Mechanism",
        "title": "Driving the cage from its edge",
        "left": {
          "kind": "none"
        },
        "media": [
          "d268-f01"
        ],
        "mediaLabel": "Exposed meat cage"
      },
      {
        "key": "tests",
        "parent": "tests",
        "eyebrow": "Test conditions",
        "title": "Separating heat, rotation and cooking",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "results",
        "parent": "results",
        "eyebrow": "Findings",
        "title": "Results and decisions",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "ending",
        "parent": "ending",
        "eyebrow": "Scope",
        "title": "Where my involvement ended",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "gallery",
        "parent": "gallery",
        "eyebrow": "Visual evidence",
        "title": "Project views",
        "left": {
          "kind": "sources"
        },
        "media": [
          "d268-f01",
          "d268-f02",
          "d268-f03"
        ],
        "mediaLabel": "Selected project views"
      },
      {
        "key": "curation-7",
        "eyebrow": "Fissler BBQ",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      },
      {
        "key": "curation-8",
        "eyebrow": "Fissler BBQ",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Undated records"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Project views",
      "description": "Three selected views of the Fissler BBQ concept."
    }
  },
  "xbox": {
    "sections": {
      "summary": "project-summary",
      "liners": "emi-liners-and-assembly-interference",
      "bracket": "a-second-sprint-airflow-around-the-drive-support",
      "gpu": "gpu-active-cooling",
      "cad": "project-cad",
      "curation-5": "proposed-development-timeline"
    },
    "media": {
      "d267-f01": {
        "galleryId": "xbox-project-cad",
        "src": "/assets/xbox/project-cad/xbox-render-01-xl.webp"
      },
      "d267-f02": {
        "galleryId": "xbox-project-cad",
        "src": "/assets/xbox/project-cad/xbox-render-02-xl.webp"
      },
      "d267-f03": {
        "galleryId": "xbox-project-cad",
        "src": "/assets/xbox/project-cad/xbox-render-03-xl.webp"
      },
      "d267-f04": {
        "galleryId": "xbox-project-cad",
        "src": "/assets/xbox/project-cad/xbox-render-04-xl.webp"
      },
      "d267-f05": {
        "galleryId": "xbox-project-cad",
        "src": "/assets/xbox/project-cad/xbox-render-05-xl.webp"
      }
    },
    "models": [],
    "scenes": [
      {
        "key": "summary",
        "parent": "summary",
        "eyebrow": "Context",
        "title": "Project summary",
        "left": {
          "kind": "context"
        },
        "media": []
      },
      {
        "key": "liners",
        "parent": "liners",
        "eyebrow": "Shielding",
        "title": "EMI liners and assembly interference",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "bracket",
        "parent": "bracket",
        "eyebrow": "Design and review",
        "title": "A second sprint: airflow around the drive support",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "gpu",
        "parent": "gpu",
        "eyebrow": "Proposal and implementation",
        "title": "GPU active cooling",
        "left": {
          "kind": "none"
        },
        "media": []
      },
      {
        "key": "cad",
        "parent": "cad",
        "eyebrow": "Project evidence",
        "title": "Project CAD",
        "left": {
          "kind": "sources"
        },
        "media": [
          "d267-f01",
          "d267-f02",
          "d267-f03",
          "d267-f04",
          "d267-f05"
        ],
        "mediaLabel": "Xbox project CAD"
      },
      {
        "key": "curation-5",
        "eyebrow": "Xbox",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Project CAD",
      "description": "Five selected project views, in their reviewed order."
    }
  },
  "motorola-mp3": {
    "sections": {
      "envelope": "a-phone-accessory-built-around-a-fixed-envelope",
      "surfaces": "from-surfaces-to-individual-parts",
      "interfaces": "making-the-interfaces-explicit",
      "manufacturing": "leaving-room-for-manufacturing-decisions",
      "handoff": "delivering-the-model-and-its-remaining-questions",
      "curation-5": "proposed-development-timeline"
    },
    "media": {
      "figure1": {
        "galleryId": "motorola-i1",
        "src": "/assets/motorola-mp3/hero-alpha-20260909/motorola-mp3-hero-01-xl.webp"
      },
      "figure2": {
        "galleryId": "motorola-i2",
        "src": "/assets/motorola-mp3/engineering-20260909/motorola-mp3-assembly-01-xl.webp"
      },
      "figure3": {
        "galleryId": "motorola-i4-cord",
        "src": "/assets/motorola-mp3/engineering-20260909/motorola-mp3-cutaway-02-xl.webp"
      },
      "figure4": {
        "galleryId": "motorola-i4-buttons",
        "src": "/assets/motorola-mp3/engineering-20260909/motorola-mp3-cutaway-04-xl.webp"
      }
    },
    "scenes": [
      {
        "key": "envelope",
        "eyebrow": "Motorola MP3",
        "left": {
          "kind": "context"
        },
        "media": [
          "figure1"
        ]
      },
      {
        "key": "surfaces",
        "eyebrow": "Motorola MP3",
        "left": {
          "kind": "none"
        },
        "media": [
          "figure2"
        ]
      },
      {
        "key": "interfaces",
        "eyebrow": "Motorola MP3",
        "left": {
          "kind": "none"
        },
        "media": [
          "figure4"
        ]
      },
      {
        "key": "manufacturing",
        "eyebrow": "Motorola MP3",
        "left": {
          "kind": "none"
        },
        "media": [
          "figure3"
        ]
      },
      {
        "key": "handoff",
        "eyebrow": "Motorola MP3",
        "left": {
          "kind": "none"
        },
        "media": [
          "figure2",
          "figure3"
        ]
      },
      {
        "key": "curation-5",
        "eyebrow": "Motorola MP3",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Proposed development timeline"
      }
    ],
    "featured": [],
    "breakout": {
      "eyebrow": "Project views",
      "description": "Product photograph, assembly geometry and annotated interface reviews."
    }
  },
  "sc48": {
    "sections": {
      "0": "making-the-integrated-console-fit",
      "1": "reuse-set-the-packaging-problem",
      "2": "the-enclosure-was-also-part-of-the-experiment",
      "3": "lower-profiles-and-different-airflow-paths",
      "4": "airflow-became-a-set-of-parts",
      "5": "surface-decisions-reached-the-boards",
      "6": "plastics-access-and-manufacturing-definition",
      "7": "the-contribution"
    },
    "media": {
      "architecture-0": {
        "galleryId": "architecture",
        "src": "/assets/sc48/full-pass-246/high-reuse-plan.webp"
      },
      "review-assembly-0": {
        "galleryId": "review-assembly",
        "src": "/assets/sc48/curation-20260930-r2/archive-dsc03749-988147048da4.jpg"
      },
      "review-architecture-0": {
        "galleryId": "review-architecture",
        "src": "/assets/sc48/curation-20260930-r2/architecture-sequence-d089fd085122.svg"
      },
      "review-comparison-0": {
        "galleryId": "review-comparison",
        "src": "/assets/sc48/curation-20260930-r2/4u-summary-comparison-bf06d791d488.svg"
      },
      "review-crossflow-0": {
        "galleryId": "review-crossflow",
        "src": "/assets/sc48/curation-20260930-r2/trace-12-5-07c-9a82e920cecb.svg"
      },
      "review-hybrid-0": {
        "galleryId": "review-hybrid",
        "src": "/assets/sc48/curation-20260930-r2/trace-12-7-07b-9c6c6ad965cb.svg"
      },
      "airflow-0": {
        "galleryId": "airflow",
        "src": "/assets/sc48/03-meltdown-mitigation/9440-58856-00.jpg"
      },
      "keepout-0": {
        "galleryId": "keepout",
        "src": "/assets/sc48/full-pass-246/control-surface-keepout.webp"
      },
      "dcd-0": {
        "galleryId": "dcd",
        "src": "/assets/sc48/full-pass-246/main-left-interface.webp"
      },
      "frame-0": {
        "galleryId": "frame",
        "src": "/assets/sc48/01-brain-transplant/9420-58318-00.jpg"
      },
      "plastics-0": {
        "galleryId": "plastics",
        "src": "/assets/sc48/02-cosmetic-shell/9440-58842-00.jpg"
      },
      "plastics-1": {
        "galleryId": "plastics",
        "src": "/assets/sc48/02-cosmetic-shell/9440-58843-00.jpg"
      },
      "review-rear-layouts-0": {
        "galleryId": "review-rear-layouts",
        "src": "/assets/sc48/curation-20260930-r2/9100-58341-00-back-rev-4-3f53ff0f3915.jpg"
      },
      "review-rear-layouts-1": {
        "galleryId": "review-rear-layouts",
        "src": "/assets/sc48/curation-20260930-r2/9100-58341-00-zoom2-a272320dbf45.jpg"
      },
      "review-wire-guide-0": {
        "galleryId": "review-wire-guide",
        "src": "/assets/sc48/curation-20260930-r2/ps-wire-guide-b9f90de897fa.jpg"
      },
      "review-wire-guide-1": {
        "galleryId": "review-wire-guide",
        "src": "/assets/sc48/curation-20260930-r2/ps-wire-guide-seal-8d684ab4c598.jpg"
      }
    },
    "scenes": [
      {
        "key": "0",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Making the integrated console fit"
      },
      {
        "key": "1",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [
          "architecture-0",
          "review-assembly-0"
        ],
        "mediaLabel": "Reuse set the packaging problem"
      },
      {
        "key": "2",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [
          "review-architecture-0",
          "review-comparison-0"
        ],
        "mediaLabel": "The enclosure was also part of the experiment"
      },
      {
        "key": "3",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [
          "review-crossflow-0",
          "review-hybrid-0"
        ],
        "mediaLabel": "Lower profiles and different airflow paths"
      },
      {
        "key": "4",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [
          "airflow-0",
          "review-wire-guide-0",
          "review-wire-guide-1"
        ],
        "mediaLabel": "Airflow became a set of parts"
      },
      {
        "key": "5",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [
          "keepout-0",
          "dcd-0",
          "review-rear-layouts-0",
          "review-rear-layouts-1"
        ],
        "mediaLabel": "Surface decisions reached the boards"
      },
      {
        "key": "6",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [
          "frame-0",
          "plastics-0",
          "plastics-1"
        ],
        "mediaLabel": "Plastics, access and manufacturing definition"
      },
      {
        "key": "7",
        "eyebrow": "SC48",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "The contribution"
      }
    ],
    "featured": []
  },
  "320-slot-optical-carousel": {
    "sections": {
      "0": "making-all-320-positions-work",
      "1": "establish-the-path-before-committing-it-to-steel",
      "2": "getting-material-through-the-geometry",
      "3": "know-what-is-actually-in-the-tool",
      "4": "inspect-the-function-at-every-position",
      "5": "a-redesign-had-to-preserve-the-interfaces",
      "6": "continue-at-the-system-and-production-support-level"
    },
    "media": {
      "full_pass_256_f01-0": {
        "galleryId": "full_pass_256_f01",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/prototype-disc-slots.webp"
      },
      "full_pass_256_f02-0": {
        "galleryId": "full_pass_256_f02",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/removable-tool-section.webp"
      },
      "full_pass_256_f03-0": {
        "galleryId": "full_pass_256_f03",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/first-molding-trial.webp"
      },
      "full_pass_256_f04-0": {
        "galleryId": "full_pass_256_f04",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/ribs-and-radii-plan.webp"
      },
      "full_pass_256_f05-0": {
        "galleryId": "full_pass_256_f05",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/slot-205-measurement.webp"
      },
      "full_pass_256_f06-0": {
        "galleryId": "full_pass_256_f06",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/inventory-scan.webp"
      },
      "review-qc-profile-0": {
        "galleryId": "review-qc-profile",
        "src": "/assets/320-slot-optical-carousel/curation-20260930-r2/qc-slot-width-profiles-1cd0e25cb6a0.svg"
      },
      "full_pass_256_f07-0": {
        "galleryId": "full_pass_256_f07",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/packaging-clearance.webp"
      },
      "full_pass_256_f08-0": {
        "galleryId": "full_pass_256_f08",
        "src": "/assets/320-slot-optical-carousel/full-pass-256/warpage-inspection.webp"
      },
      "review-qc-locations-0": {
        "galleryId": "review-qc-locations",
        "src": "/assets/320-slot-optical-carousel/curation-20260930-r2/qc-locations-7fd59b40adc9.png"
      }
    },
    "scenes": [
      {
        "key": "0",
        "eyebrow": "320-Slot Carousel",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Making all 320 positions work"
      },
      {
        "key": "1",
        "eyebrow": "320-Slot Carousel",
        "left": {
          "kind": "none"
        },
        "media": [
          "full_pass_256_f01-0"
        ],
        "mediaLabel": "Establish the path before committing it to steel"
      },
      {
        "key": "2",
        "eyebrow": "320-Slot Carousel",
        "left": {
          "kind": "none"
        },
        "media": [
          "full_pass_256_f02-0",
          "full_pass_256_f03-0",
          "full_pass_256_f04-0"
        ],
        "mediaLabel": "Getting material through the geometry"
      },
      {
        "key": "3",
        "eyebrow": "320-Slot Carousel",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "Know what is actually in the tool"
      },
      {
        "key": "4",
        "eyebrow": "320-Slot Carousel",
        "left": {
          "kind": "none"
        },
        "media": [
          "full_pass_256_f05-0",
          "full_pass_256_f06-0",
          "review-qc-profile-0",
          "review-qc-locations-0"
        ],
        "mediaLabel": "Inspect the function at every position"
      },
      {
        "key": "5",
        "eyebrow": "320-Slot Carousel",
        "left": {
          "kind": "none"
        },
        "media": [],
        "mediaLabel": "A redesign had to preserve the interfaces"
      },
      {
        "key": "6",
        "eyebrow": "320-Slot Carousel",
        "left": {
          "kind": "none"
        },
        "media": [
          "full_pass_256_f07-0",
          "full_pass_256_f08-0"
        ],
        "mediaLabel": "Continue at the system and production-support level"
      }
    ],
    "featured": []
  }
};
