'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSound from "use-sound";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const splashSound = "/sounds/a.mp3";

import {
  GlobeIcon,
  ZapIcon,
  BrainCogIcon,
  EyeIcon,
  ServerCogIcon,
  MonitorSmartphoneIcon,
} from "lucide-react";

const features = [
  {
    name: "Secure PDF Vault",
    description: "Encrypt and safeguard your documents with enterprise-grade security.",
    icon: GlobeIcon,
  },
  {
    name: "Blazing-Fast Insights",
    description: "Get instant answers to your questions, powered by advanced AI.",
    icon: ZapIcon,
  },
  {
    name: "Intelligent Memory",
    description: "QueryPDF AI remembers your context and tailors responses accordingly.",
    icon: BrainCogIcon,
  },
  {
    name: "Immersive PDF Interaction",
    description: "Engage with documents like never before: explore, extract, and converse.",
    icon: EyeIcon,
  },
  {
    name: "Automated Cloud Sync",
    description: "Effortlessly back up and access your PDFs from anywhere.",
    icon: ServerCogIcon,
  },
  {
    name: "Multi-Device Support",
    description: "Seamlessly switch between desktop, tablet, and mobile.",
    icon: MonitorSmartphoneIcon,
  },
];

export default function MainPage() {
  const [started, setStarted] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [playSound] = useSound(splashSound, { volume: 0.4 });

  const handleAgree = () => {
    playSound();
    setShowSplash(true);
    setTimeout(() => {
      setShowSplash(false);
      setStarted(true);
    }, 3000);
  };

  return (
    <main className="flex-1 overflow-auto bg-black text-yellow-300 relative">
      {/* Initial Agreement Screen */}
      {!started && !showSplash && (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black text-yellow-300 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-bold mb-6"
          >
            Welcome to QueryPDF AI
          </motion.h1>
          <p className="max-w-xl text-sm sm:text-base text-gray-400 mb-6">
            By clicking &quot;I Agree&quot;, you acknowledge and accept the terms of use.
          </p>

          <div className="text-center space-y-4">
            <div>
            <button
              onClick={handleAgree}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-3 rounded-xl transition"
            >
              I Agree & Start
            </button>
            </div>

            <button
              type="button"
              onClick={() => setShowTerms((prev) => !prev)}
              className="text-sm text-yellow-400 underline underline-offset-4 hover:text-yellow-300 transition"
            >
              {showTerms ? "Hide Terms & Conditions" : "View Terms & Conditions"}
            </button>

            {showTerms && (
              <div className="mt-4 bg-black/90 border border-yellow-500 rounded-md px-5 py-4 text-xs sm:text-sm text-yellow-200 text-left max-w-md mx-auto shadow-lg">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Uploaded files are stored on our servers for processing.</li>
                  <li>You are fully responsible for the content you upload.</li>
                  <li>The developers and platform maintainers are not liable for data loss, breaches, or misuse.</li>
                  <li>Do not upload confidential, sensitive, or regulated documents.</li>
                  <li>Use this platform at your own risk and discretion.</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Splash Animation */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-black text-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.h1
              initial={{ scale: 0.2, opacity: 0 }}
              animate={{
                scale: [0.2, 1.5, 1],
                opacity: [0, 1],
              }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
              className="text-6xl sm:text-7xl lg:text-[6rem] font-extrabold text-yellow-400 tracking-wide drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]"
            >
              QueryPDF AI
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-400 mt-4"
            >
              Brought to you by{" "}
              <span className="text-indigo-400 font-semibold">Sy Alejandrino</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {started && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="relative py-28 px-6 sm:px-8 lg:px-16 border border-yellow-500/30 shadow-xl bg-black/80 rounded-md"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-yellow-500 text-sm font-bold tracking-widest uppercase mb-4"
            >
              Your AI-Powered PDF Companion
            </motion.h2>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight"
            >
              Interact With Documents Like Never Before
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="mt-6 text-lg sm:text-xl text-gray-300"
            >
              Upload PDFs. Ask questions. Get instant, smart answers.{" "}
              <span className="text-yellow-400 font-bold">No fluff. Just intelligence.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Button
                asChild
                className="mt-10 px-8 py-3 bg-yellow-500 text-black text-md font-semibold hover:bg-yellow-400 transition rounded-xl"
              >
                <Link href="/dashboard">Launch the Experience</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-20"
          >
            <Image
              alt="App Screenshot"
              src="https://i.imgur.com/2831Xqt.png"
              width={2432}
              height={1442}
              className="rounded-xl shadow-2xl ring-1 ring-yellow-500/30"
            />
          </motion.div>

          <div className="mt-24 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 text-base leading-7">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                className="relative pl-12"
              >
                <feature.icon className="absolute left-0 top-1 h-6 w-6 text-yellow-500" aria-hidden="true" />
                <dt className="font-bold text-yellow-400 mb-2">{feature.name}</dt>
                <dd className="text-gray-400">{feature.description}</dd>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </main>
  );
}
