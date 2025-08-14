import Canvas from '@layout/Canvas';
import SettingsPanel from '@layout/SettingsPanel';
import TopBar from '@layout/TopBar';
import type { PageSchema } from '@blocks/shared/Page';
import type { Theme } from '@blocks/shared/Style';
import type { Platform } from '@blocks/shared/Visibility';
import LibraryPanel from '@layout/LibraryPanel';
import { SelectionProvider } from '@context/SelectionContext';
import { HistoryProvider } from '@context/HistoryContext';
import { BlockInsertProvider } from '@context/BlockInsertContext';
import { useState } from 'react';

// Move the sample schema here so it can be shared
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
        },
        {
          type: "text",
          id: "text-004",
          props: {
            content: "This message is shown only to VIP users in the US."
          },
          style: {
            textAlign: "center",
            padding: "md",
            backgroundColor: "#fff",
            borderRadius: "md",
            boxShadow: "sm"
          },
          visibility: {
            platform: ["mobile", "desktop"],
            region: ["US"],
            subscriptionTier: "vip",
            isLoggedIn: true
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
    },
    {
      id: 'footer-1',
      type: 'footer',
      props: {
        items: [
          {
            id: 'company-col',
            title: 'Company',
            links: [
              { id: 'about', label: 'About Us', url: '/about' },
              { id: 'careers', label: 'Careers', url: '/careers' },
              { id: 'press', label: 'Press', url: '/press' }
            ]
          },
          {
            id: 'support-col',
            title: 'Support',
            links: [
              { id: 'help', label: 'Help Center', url: '/help' },
              { id: 'contact', label: 'Contact Us', url: '/contact' },
              { id: 'faq', label: 'FAQ', url: '/faq' }
            ]
          },
          {
            id: 'legal-col',
            title: 'Legal',
            links: [
              { id: 'privacy', label: 'Privacy Policy', url: '/privacy' },
              { id: 'terms', label: 'Terms of Service', url: '/terms' },
              { id: 'cookies', label: 'Cookie Policy', url: '/cookies' }
            ]
          }
        ],
        socialLinks: [
          { id: 'facebook', platform: 'linkedin', url: "https://www.linkedin.com/company/testpress/posts/?feedView=all" },
          { id: 'instagram', platform: 'instagram', url: 'https://www.instagram.com/testpress_official?igsh=Nmw1Mmg0Y2R0Mm5h' }
        ],
        branding: '© 2025 Flimix Inc. All rights reserved.'
      },
      style: {
        backgroundColor: '#1e293b',
        textColor: '#f8fafc',
        padding: 'lg',
      }
    }
  ]
};

function App() {
  const [showDebug, setShowDebug] = useState(false);

  return (
    <HistoryProvider initialSchema={sampleSchema}>
      <SelectionProvider>
        <BlockInsertProvider>
          <div className="h-screen flex flex-col bg-gray-50">
            <TopBar />
            <div className="flex-1 flex pt-16">
              <LibraryPanel />
              <Canvas showDebug={showDebug} />
              <SettingsPanel 
                showDebug={showDebug}
                onToggleShowDebug={() => setShowDebug(current => !current)}
              />
            </div>
          </div>
        </BlockInsertProvider>
      </SelectionProvider>
    </HistoryProvider>
  );
}

export default App;
