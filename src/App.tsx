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
import { LibraryPanelProvider } from '@context/LibraryPanelContext';
import { SettingsPanelProvider } from '@context/SettingsPanelContext';
import { useState } from 'react';

// Move the sample schema here so it can be shared
const sampleSchema: PageSchema = {
  title: "Flimix Studio",
  theme: "dark" as Theme,
  visibility: {
    platform: ["mobile", "desktop"] as Platform[]
  },
  blocks: [
    {
      type: "hero",
      id: "hero-001",
      props: {
        variant: "carousel",
        aspectRatio: "16:9",
        autoplay: false,
        showArrows: true,
        scrollSpeed: 3000,
        items: [
          {
            id: "hero-item-1",
            title: "Coolie",
            subtitle: "A porter at a railway station becomes involved in a dangerous conflict when he stands up against a powerful criminal who exploits the poor.",
            backgroundImage: "",
            videoBackground: "https://dlbdnoa93s0gw.cloudfront.net/transcoded/4P3nJXp2xFT/video.m3u8",
            metadata: {
              year: "2023",
              language: "Tamil"
            },
            badges: [
              { id: "badge-1", label: "Action" },
              { id: "badge-2", label: "Drama" },
              { id: "badge-3", label: "Thriller" }
            ],
            primaryCTA: {
              label: "Watch Now",
              link: "/watch/coolie",
              variant: "solid",
              backgroundColor: "#dc2626",
              textColor: "#ffffff"
            },
            secondaryCTA: {
              label: "+ Add to Watchlist",
              link: "/watchlist/coolie",
              variant: "outline",
              backgroundColor: "#ffffff",
              textColor: "#000000"
            }
          },
          {
            id: "hero-item-2",
            title: "Cooku with Comali",
            subtitle: "When cooking chaos meets comic charm! Comalis pair up with stars for a rib-tickling contest, judged by chefs Damu, Koushik Shankar and Madhampatty Rangaraj.",
            backgroundImage: "https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/5887/1754983435887-i",
            videoBackground: "",
            metadata: {
              year: "2025",
              seasons: "4",
              language: "Tamil"
            },
            badges: [
              { id: "badge-4", label: "Reality" },
              { id: "badge-5", label: "Comedy" },
              { id: "badge-6", label: "Culinary" }
            ],
            primaryCTA: {
              label: "Watch Now",
              link: "/watch",
              variant: "solid",
              backgroundColor: "#dc2626",
              textColor: "#ffffff"
            },
            secondaryCTA: {
              label: "+ Add to Watchlist",
              link: "/watchlist",
              variant: "outline",
              backgroundColor: "#ffffff",
              textColor: "#000000"
            }
          },
          {
            id: "hero-item-3",
            title: "Leo",
            subtitle: "A café owner and animal rescuer becomes the target of a drug cartel who believes he is the infamous vigilante they've been hunting for years.",
            backgroundImage: "",
            videoBackground: "https://dlbdnoa93s0gw.cloudfront.net/transcoded/As5D9fDscz2/video.m3u8",
            metadata: {
              year: "2023",
              language: "Tamil"
            },
            badges: [
              { id: "badge-7", label: "Action" },
              { id: "badge-8", label: "Thriller" },
              { id: "badge-9", label: "Drama" }
            ],
            primaryCTA: {
              label: "Watch Now",
              link: "/watch/leo",
              variant: "solid",
              backgroundColor: "#dc2626",
              textColor: "#ffffff"
            },
            secondaryCTA: {
              label: "+ Add to Watchlist",
              link: "/watchlist/leo",
              variant: "outline",
              backgroundColor: "#ffffff",
              textColor: "#000000"
            }
          },
          {
            id: "hero-item-4",
            title: "Vikram",
            subtitle: "A special agent investigates a murder committed by a masked group of serial killers. However, a tangled maze of clues soon leads him to the drug kingpin of Chennai.",
            backgroundImage: "",
            videoBackground: "https://dlbdnoa93s0gw.cloudfront.net/transcoded/57gHcHDBxKX/video.m3u8",
            metadata: {
              year: "2022",
              language: "Tamil"
            },
            badges: [
              { id: "badge-10", label: "Action" },
              { id: "badge-11", label: "Thriller" },
              { id: "badge-12", label: "Crime" }
            ],
            primaryCTA: {
              label: "Watch Now",
              link: "/watch/vikram",
              variant: "solid",
              backgroundColor: "#dc2626",
              textColor: "#ffffff"
            },
            secondaryCTA: {
              label: "+ Add to Watchlist",
              link: "/watchlist/vikram",
              variant: "outline",
              backgroundColor: "#ffffff",
              textColor: "#000000"
            }
          }
        ]
      },
      style: {
        backgroundColor: "#000000",
        textColor: "#ffffff",
        padding: "lg",
        margin: "none",
        borderRadius: "none",
        textAlign: "left"
      },
      visibility: {
        platform: ["mobile", "desktop"],
        region: ["IN", "US"]
      }
    },
    {
      type: "carousel",
      id: "carousel-latest",
      props: {
        title: "Latest Releases",
        itemShape: "rectangle-portrait",
        alignment: "left",
        autoplay: false,
        scrollSpeed: 3000,
        showArrows: true,
        itemSize: "medium",
        items: [
          {
            id: "item-1",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/3084/1755330873084-v",
            link: "/movie/the-rage",
          },
          {
            id: "item-2",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/6738/1755229966738-v"
          },
          {
            id: "item-3",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/4186/1754287614186-v"
          },
          {
            id: "item-4",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/1300/1755500481300-v"
          },
          {
            id: "item-5",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90/sources/r1/cms/prod/5166/1754460935166-v"
          },
          {
            id: "item-6",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90/sources/r1/cms/prod/1300/1755500481300-v"
          }
        ]
      },
      style: {
        backgroundColor: "black",
        textColor: "#ffffff",
      }
    },
    {
      type: "carousel",
      id: "carousel-sports",
      props: {
        title: "Non-Stop Sports",
        itemShape: "rectangle-landscape",
        alignment: "left",
        autoplay: false,
        scrollSpeed: 3000,
        showArrows: true,
        itemSize: "medium",
        items: [
          {
            id: "sports-1",
            title: "East Delhi Riders (W) vs Central Delhi Queens (W)",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/419/1755426930419-h",
            meta: {
              badge: "LIVE"
            }
          },
          {
            id: "sports-2",
            title: "Manchester United 0-1 Arsenal",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/4567/1755452254567-h",
            meta: {
              duration: "6m"
            }
          },
          {
            id: "sports-3",
            title: "American Stars to Watch ft. Fritz, Gauff",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/5504/1755443005504-h",
            meta: {
              duration: "5m"
            }
          },
          {
            id: "sports-4",
            title: "Chelsea 0-0 Crystal Palace",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/2717/1755443282717-h",
            meta: {
              duration: "5m"
            }
          },
          {
            id: "sports-5",
            title: "South Delhi Superstarz vs Purani Dilli-6: Highlights",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/7333/1755452777333-h",
            meta: {
              duration: "12m"
            }
          }
        ]
      },
      style: {
        backgroundColor: "black",
        textColor: "#ffffff",
        padding: "none"
      }
    },
    {
      type: "section",
      id: "section-independence-day",
      props: {
        title: "",
        backgroundImage: "https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/4574/1754455844574-uwb"
      },
      style: {
        backgroundColor: "black",
        textColor: "#ffffff",
      },
      children: [
        {
          type: "text",
          id: "text-independence-title",
          props: {
            content: "One Tiranga. Infinite Stories."
          },
          style: {
            textAlign: "center",
            backgroundColor: "transparent",
            textColor: "#ffffff",
            padding: "none"
          }
        },
        {
          type: "text",
          id: "text-independence-subtitle",
          props: {
            content: "Tales of the Tricolour"
          },
          style: {
            textAlign: "center",
            backgroundColor: "transparent",
            textColor: "#999999",
            padding: "none"
          }
        },
        {
          type: "carousel",
          id: "carousel-independence",
          props: {
            title: "",
            itemShape: "square",
            alignment: "left",
            autoplay: true,
            scrollSpeed: 2000,
            showArrows: false,
            itemSize: "medium",
            items: [
              {
                id: "independence-1",
                title: "",
                image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/5218/1755108255218-v",
                link: "/movie/salaar"
              },
              {
                id: "independence-2",
                title: "",
                image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/7004/1753382647004-v"
              },
              {
                id: "independence-3",
                title: "",
                image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/7472/1754202297472-v"
              },
              {
                id: "independence-4",
                title: "",
                image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/3876/1751871283876-v"
              },
              {
                id: "independence-5",
                title: "",
                image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/9974/1738830599974-v"
              },
              {
                id: "independence-6",
                title: "",
                image: "	https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/2984/1734434352984-v"
              }
            ]
          },
          style: {
            backgroundColor: "transparent",
            textColor: "#ffffff",
            padding: "none"
          }
        }
      ]
    },
    {
     type: "carousel",
     id: "carousel-studios",
     props: {
       title: "Studio",
       itemShape: "rectangle-landscape",
       alignment: "left",
       autoplay: true,
       scrollSpeed: 2000,
       showArrows: false,
       itemSize: "medium",
       items: [
         {
           id: "studio-1",
           title: "",
           image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/5598/1739441155598-a",
           link: "/studio/hotstar",
         },
         {
           id: "studio-2",
           title: "",
           image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/3703/1747996723703-a",
           link: "/studio/disney"
         },
         {
           id: "studio-3",
           title: "",
           image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/5731/1739780835731-a",
           link: "/studio/hbo"
         },
         {
           id: "studio-4",
           title: "",
           image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/7816/1739359307816-a",
           link: "/studio/peacock"
         },
         {
          id: "studio-5",
          title: "",
          image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_1920/sources/r1/cms/prod/583/1739358280583-a",
          link: "/studio/peacock"
        },
       ]
     },
     style: {
       backgroundColor: "transparent",
       textColor: "#ffffff",
       padding: "none",
       gridGap: "sm"
     }
    },
    {
      type: "carousel",
      id: "carousel-latest1",
      props: {
        title: "Action Extravaganza",
        itemShape: "rectangle-portrait",
        alignment: "left",
        autoplay: false,
        scrollSpeed: 3000,
        showArrows: true,
        itemSize: "medium",
        items: [
          {
            id: "item1-1",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/3212/1754203333212-v",
            link: "/movie/the-rage",
          },
          {
            id: "item1-2",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/7083/1754907187083-v"
          },
          {
            id: "item1-3",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/4706/1743158284706-v"
          },
          {
            id: "item1-4",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/4354/1734949344354-v"
          },
          {
            id: "item1-5",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/5375/1739947275375-v"
          },
          {
            id: "item1-6",
            title: "",
            image: "https://img.hotstar.com/image/upload/f_auto,q_90,w_384/sources/r1/cms/prod/486/1747141090486-v"
          }
        ]
      },
      style: {
        backgroundColor: "black",
        textColor: "#ffffff",
      }
    },
    {
      type: "footer",
      id: "footer-main",
      props: {
        items: [
          {
            id: "col-company",
            title: "Company",
            links: [
              { id: "about", label: "About Us", url: "/about" },
              { id: "careers", label: "Careers", url: "/careers" }
            ]
          },
          {
            id: "col-language",
            title: "View Website in",
            links: [
              { id: "lang-en", label: "English", url: "#" }
            ]
          },
          {
            id: "col-help",
            title: "Need Help?",
            links: [
              { id: "help-center", label: "Visit Help Center", url: "/help" },
              { id: "feedback", label: "Share Feedback", url: "/feedback" }
            ]
          },
          {
            id: "col-legal",
            title: "Legal",
            links: [
              { id: "terms", label: "Terms of Use", url: "/terms" },
              { id: "privacy", label: "Privacy Policy", url: "/privacy" },
              { id: "faq", label: "FAQ", url: "/faq" }
            ]
          }
        ],
        socialLinks: [
          { id: 'facebook', platform: 'linkedin', url: "https://www.linkedin.com/company/testpress/posts/?feedView=all" },
          { id: 'instagram', platform: 'instagram', url: 'https://www.instagram.com/testpress_official?igsh=Nmw1Mmg0Y2R0Mm5h' }
        ],
        branding: "© 2025 STAR. All Rights Reserved."
      },
      style: {
        backgroundColor: "black",
        textColor: "#e5e7eb",
        padding: "lg",
        textAlign: "left",
        borderRadius: "none",
        boxShadow: "none"
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
          <LibraryPanelProvider>
            <SettingsPanelProvider>
              <div className="min-h-screen flex flex-col bg-black">
                <TopBar />
                <div className="flex-1 flex pt-16 min-h-0">
                  <LibraryPanel />
                  <Canvas showDebug={showDebug} />
                  <SettingsPanel 
                    showDebug={showDebug}
                    onToggleShowDebug={() => setShowDebug(current => !current)}
                  />
                </div>
              </div>
            </SettingsPanelProvider>
          </LibraryPanelProvider>
        </BlockInsertProvider>
      </SelectionProvider>
    </HistoryProvider>
  );
}

export default App;
