"use client";

import { motion } from "framer-motion";
import {
  Gamepad2,
  Music,
  Mic2,
  Flame,
  Users,
  Sparkles,
  Crown,
} from "lucide-react";

function District({
  title,
  subtitle,
  icon,
  activity,
  color,
}: {
  title: string;
  subtitle: string;
  icon: any;
  activity: string;
  color: string;
}) {
  const Icon = icon;

  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      className="relative rounded-3xl border border-white/10 bg-black/50 backdrop-blur-xl p-6 cursor-pointer overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20 blur-2xl"
        style={{ background: color }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <Icon className="text-[#00f2ff]" size={26} />

          <span className="text-[10px] uppercase tracking-[3px] text-white/50">
            {activity} active
          </span>
        </div>

        <h3 className="mt-6 text-xl font-black text-white">{title}</h3>

        <p className="text-sm text-white/60 mt-2">{subtitle}</p>

        <button className="mt-6 text-[10px] uppercase tracking-[4px] text-[#00f2ff]">
          Enter District
        </button>
      </div>
    </motion.div>
  );
}

export default function GamingPage() {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      
      <div className="max-w-[1500px] mx-auto">

        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[6px] text-[#00f2ff]/60">
            PARABLE GAMING
          </p>

          <h1 className="text-5xl font-black mt-3">
            Sanctuary World
          </h1>

          <p className="text-white/60 mt-4 max-w-[600px]">
            Enter the digital city where worship, storytelling, fellowship,
            and gaming collide. Explore districts, join experiences,
            and build the Kingdom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          <District
            title="Sanctuary Plaza"
            subtitle="The central hub where the community gathers."
            icon={Sparkles}
            activity="1.2k"
            color="radial-gradient(circle, #00f2ff, transparent)"
          />

          <District
            title="Praise Break Arena"
            subtitle="Rhythm battles, worship dance challenges."
            icon={Music}
            activity="742"
            color="radial-gradient(circle, #00f2ff, transparent)"
          />

          <District
            title="Testimony Stage"
            subtitle="Share powerful testimonies with the world."
            icon={Mic2}
            activity="389"
            color="radial-gradient(circle, #00f2ff, transparent)"
          />

          <District
            title="Prayer Garden"
            subtitle="A peaceful place for prayer and reflection."
            icon={Flame}
            activity="216"
            color="radial-gradient(circle, #00f2ff, transparent)"
          />

          <District
            title="Fellowship Hall"
            subtitle="Chat rooms, bible studies, and discussions."
            icon={Users}
            activity="512"
            color="radial-gradient(circle, #00f2ff, transparent)"
          />

          <District
            title="Kingdom Builder"
            subtitle="Build ministries and grow influence."
            icon={Crown}
            activity="108"
            color="radial-gradient(circle, #00f2ff, transparent)"
          />

        </div>
      </div>
    </div>
  );
}