import React, { useState } from 'react';
import BlockRenderer from './BlockRenderer';
import type { PageSchema, Theme, Platform } from '../schema/blockTypes';
import type { RenderContext } from '../types/RenderContext';

// Debug flag for development - shows hidden blocks due to visibility rules
const showDebug = true; // Enables debug placeholder for hidden blocks

// Hardcoded sample schema with proper typing and visibility rules
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
      },
      visibility: {
        platform: ["mobile", "desktop"],
        region: ["IN", "US"]
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
      visibility: {
        isLoggedIn: true,
        platform: ["mobile", "desktop"]
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
            padding: "md",
            backgroundColor: "#f8f9fa"
          },
          visibility: {
            isSubscribed: false
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
            padding: "sm",
            backgroundColor: "#f8f9fa"
          },
          visibility: {
            subscriptionTier: "premium"
          }
        }
      ]
    },
    {
      type: "text",
      id: "text-003",
      props: {
        content: "This block should be hidden for mobile users."
      },
      style: {
        textAlign: "center",
        padding: "md",
        backgroundColor: "#e9ecef"
      },
      visibility: {
        platform: ["desktop", "tv"]
      }
    }
  ]
};

const initialRenderContext: RenderContext = {
  isLoggedIn: true,
  isSubscribed: false,
  subscriptionTier: 'basic',
  region: 'IN',
  platform: 'mobile',
};

const Canvas: React.FC = () => {
  const [renderContext, setRenderContext] = useState<RenderContext>(initialRenderContext);

  return (
    <div className="flex-1 bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {sampleSchema.title}
            </h2>
            
            {/* Render Context Controls */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Platform:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={renderContext.platform}
                  onChange={e => setRenderContext(ctx => ({ ...ctx, platform: e.target.value as Platform }))}
                >
                  <option value="mobile">Mobile</option>
                  <option value="desktop">Desktop</option>
                  <option value="tv">TV</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Region:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={renderContext.region}
                  onChange={e => setRenderContext(ctx => ({ ...ctx, region: e.target.value }))}
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700 font-medium">Tier:</label>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={renderContext.subscriptionTier}
                  onChange={e => setRenderContext(ctx => ({ ...ctx, subscriptionTier: e.target.value }))}
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={renderContext.isLoggedIn}
                    onChange={e => setRenderContext(ctx => ({ ...ctx, isLoggedIn: e.target.checked }))}
                    className="rounded"
                  />
                  Logged In
                </label>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={renderContext.isSubscribed}
                    onChange={e => setRenderContext(ctx => ({ ...ctx, isSubscribed: e.target.checked }))}
                    className="rounded"
                  />
                  Subscribed
                </label>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600">Rendering {sampleSchema.blocks.length} blocks</p>
          {showDebug && (
            <>
              <p className="text-xs text-yellow-600 mt-2 bg-yellow-50 p-2 rounded">
                🔍 Debug mode enabled - hidden blocks will show debug messages
              </p>
              <pre className="text-xs text-gray-700 bg-gray-50 rounded p-2 mt-2 overflow-x-auto">
                {JSON.stringify(renderContext, null, 2)}
              </pre>
            </>
          )}
        </div>
        
        <div className="space-y-6">
          {sampleSchema.blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} showDebug={showDebug} renderContext={renderContext} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Canvas; 