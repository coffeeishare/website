/**
 * Contentful Migration: Create projectDetail content type
 *
 * Usage:
 *   npx contentful-migration --space-id $CONTENTFUL_SPACE_ID \
 *     --access-token $CONTENTFUL_MANAGEMENT_TOKEN \
 *     migrations/create-project-detail.js
 */

module.exports = function (migration) {
  const projectDetail = migration.createContentType("projectDetail", {
    name: "Project Detail",
    description: "Full case study page for a portfolio project",
    displayField: "slug",
  })

  // ── Identifiers ──────────────────────────────────────────────────────────

  projectDetail.createField("slug", {
    name: "Slug",
    type: "Symbol",
    required: true,
    validations: [{ unique: true }],
  })

  projectDetail.createField("title", {
    name: "Title",
    type: "Symbol",
    required: true,
  })

  projectDetail.createField("client", {
    name: "Client",
    type: "Symbol",
    required: true,
  })

  // ── Metadata ─────────────────────────────────────────────────────────────

  projectDetail.createField("year", {
    name: "Year",
    type: "Symbol",
  })

  projectDetail.createField("teamRoles", {
    name: "Team Roles",
    type: "Array",
    items: {
      type: "Symbol",
    },
  })

  projectDetail.createField("skills", {
    name: "Skills",
    type: "Array",
    items: {
      type: "Symbol",
    },
  })

  // ── Media ────────────────────────────────────────────────────────────────

  projectDetail.createField("heroImage", {
    name: "Hero Image",
    type: "Link",
    linkType: "Asset",
  })

  // ── Content ──────────────────────────────────────────────────────────────

  projectDetail.createField("introText", {
    name: "Intro Text",
    type: "Text",
  })

  projectDetail.createField("pullQuote", {
    name: "Pull Quote",
    type: "Text",
  })

  projectDetail.createField("bodySections", {
    name: "Body Sections",
    type: "RichText",
    validations: [
      {
        enabledNodeTypes: [
          "heading-4",
          "paragraph",
          "unordered-list",
          "ordered-list",
          "list-item",
          "blockquote",
          "embedded-asset-block",
          "hr",
        ],
      },
      {
        enabledMarks: ["bold", "italic", "underline"],
      },
    ],
  })

  projectDetail.createField("closingQuote", {
    name: "Closing Quote",
    type: "Text",
  })

  // ── Relations ────────────────────────────────────────────────────────────

  projectDetail.createField("relatedProjects", {
    name: "Related Projects",
    type: "Array",
    items: {
      type: "Link",
      linkType: "Entry",
      validations: [
        {
          linkContentType: ["projectDetail"],
        },
      ],
    },
  })

  // ── Editor appearance ────────────────────────────────────────────────────

  migration.editContentType("projectDetail").changeFieldControl("slug", "builtin", "slugEditor", {
    trackingFieldId: "title",
  })

  migration.editContentType("projectDetail").changeFieldControl("introText", "builtin", "multipleLine")
  migration.editContentType("projectDetail").changeFieldControl("pullQuote", "builtin", "multipleLine")
  migration.editContentType("projectDetail").changeFieldControl("closingQuote", "builtin", "multipleLine")
}
