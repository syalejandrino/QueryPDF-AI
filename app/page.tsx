import { Button } from "@/components/ui/button";
import {
  BrainCogIcon,
  EyeIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    name: "Secure PDF Storage",
    description: "Safely store and access all your important PDFs, anytime and from anywhere, with peace of mind.",
    icon: GlobeIcon,
  },
  {
    name: "Instant Response Time",
    description: "Get lightning-fast answers to your questions, delivering the information you need in a flash.",
    icon: ZapIcon,
  },
  {
    name: "Smart Chat Memory",
    description: "Our chatbot remembers your past interactions, ensuring a smooth and personalized experience every time.",
    icon: BrainCogIcon,
  },
  {
    name: "Interactive PDF Experience",
    description: "Dive deeper into your PDFs with our intuitive, interactive viewer that brings your documents to life.",
    icon: EyeIcon,
  },
  {
    name: "Automatic Cloud Backup",
    description: "Never worry about losing your documents—your files are automatically backed up and secure in the cloud.",
    icon: ServerCogIcon,
  },
  {
    name: "Cross-Device Compatibility",
    description: "Seamlessly access and interact with your PDFs on any device—whether it's your desktop, tablet, or smartphone.",
    icon: MonitorSmartphoneIcon
  }
]

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="bg-white py:24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Meet Your Document Companion
            </h2>

            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              PDFs into Interactive Conversations    
            </p>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Introducing {" "}
              <span className="font-bold text-indigo-600">PDFQuery AI.</span>
              <br />
              <br /> Upload your document, and our chatbot will provide summaries, answer your questions, and assist with all your inquiries.
              Perfect for everyone, <span className="text-indigo-600">
                QueryPDF AI
              </span>{" "}
              turns static documents into {" "}
              <span className="font-bold">Dynamic Conversations</span>,
              effortlessly boosting productivity.
            </p>
          </div>

          <Button asChild className="mt-10">
            <Link href='/dashboard'>Get Started</Link>
          </Button>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image 
              alt = "App Screenshot"
              src = "https://i.imgur.com/RwABxvj.png"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
        <dl className="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 
        text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {features.map((feature) => (
            <div key={feature.name} className="relative pl-9">
              <dt className="inline font-semibold text-gray-900">
                <feature.icon 
                    aria-hidden="true"
                    className="absolute left-1 top-1 h-5 w-5 text-indigo-600"
                  />
              </dt>
              <dd>{feature.description}</dd>
            </div>
          ))}
        </dl>
      </div>
      </div>
    </main>
  );
}
