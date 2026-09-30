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
  }
};
