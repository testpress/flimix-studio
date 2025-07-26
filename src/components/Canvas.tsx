import React from 'react';
import BlockRenderer from './BlockRenderer';
import type { PageSchema, Theme, Platform } from '../schema/blockTypes';

// Hardcoded sample schema with proper typing
const sampleSchema: PageSchema = {
  title: "Flimix Landing",
  theme: "dark" as Theme,
  visibility: {
    platform: ["mobile", "desktop"] as Platform[]
  },
  blocks: [
    {
      type: "hero",
      id: "hero-001",
      props: {
        title: "Watch Anywhere",
        subtitle: "Stream your favorites",
        backgroundImage: "https://cdn.example.com/bg.jpg",
        ctaButton: {
          label: "Start Watching",
          link: "/subscribe"
        }
      },
      style: {
        theme: "dark" as Theme,
        padding: "lg"
      }
    },
    {
      type: "section",
      id: "section-001",
      props: {
        title: "Featured Content",
        description: "Discover our latest releases and popular shows"
      },
      style: {
        theme: "light" as Theme,
        padding: "lg",
        backgroundColor: "#f8f9fa",
        borderRadius: "lg"
      },
      children: [
        {
          type: "text",
          id: "text-001",
          props: {
            content: "Enjoy Flimix across all your devices."
          },
          style: {
            textAlign: "center",
            padding: "md"
          }
        },
        {
          type: "text",
          id: "text-002",
          props: {
            content: "From blockbuster movies to binge-worthy series, we have something for everyone."
          },
          style: {
            textAlign: "center",
            padding: "sm"
          }
        }
      ]
    }
  ]
};

const Canvas: React.FC = () => {
  return (
    <div className="flex-1 bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            {sampleSchema.title}
          </h2>
          <p className="text-gray-600">Rendering {sampleSchema.blocks.length} blocks</p>
        </div>
        
        <div className="space-y-6">
          {sampleSchema.blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas; 