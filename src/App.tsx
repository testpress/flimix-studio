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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    }
  ]
};

function App() {
  return (
    <HistoryProvider initialSchema={sampleSchema}>
      <SelectionProvider>
        <BlockInsertProvider>
          <div className="h-screen flex flex-col bg-gray-50">
            <TopBar />
            <div className="flex-1 flex pt-16">
              <LibraryPanel />
              <Canvas />
              <SettingsPanel />
            </div>
            <ToastContainer />
          </div>
        </BlockInsertProvider>
      </SelectionProvider>
    </HistoryProvider>
  );
}

export default App;
