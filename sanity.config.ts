"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { presentationTool } from "sanity/presentation";
import { structureTool } from "sanity/structure";
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schemaTypes, singletonTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";

export default defineConfig({
  name: "oltenia",
  title: "Oltenia · Contenido del sitio",

  projectId: projectId ?? "",
  dataset,
  basePath: "/studio",

  schema: { types: schemaTypes },

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: { enable: "/api/draft-mode/enable" },
      },
    }),
    // GROQ playground, useful for the developer maintaining this site.
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  document: {
    // Singletons: exactly one instance, created once by the migration script.
    // Hide "duplicate", "delete" and "create new" so the owner can't end up
    // with zero or several copies of a document the app expects to find by id.
    actions: (input, context) =>
      singletonTypes.includes(context.schemaType as (typeof singletonTypes)[number])
        ? input.filter(({ action }) => action && !["duplicate", "delete"].includes(action))
        : input,
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((item) => !singletonTypes.includes(item.templateId as (typeof singletonTypes)[number]));
      }
      return prev;
    },
  },
});
