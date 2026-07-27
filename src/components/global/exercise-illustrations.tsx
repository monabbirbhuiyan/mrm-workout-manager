"use client";

import React from "react";

type Props = { className?: string; size?: number };

function Fig({ children, className, size = 100 }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function Head({ x, y }: { x: number; y: number }) {
  return <circle cx={x} cy={y} r={4} fill="currentColor" />;
}

function Torso({ x, y }: { x: number; y: number }) {
  return <line x1={x} y1={y} x2={x} y2={y + 18} />;
}

function StandingBase({ x, y }: { x: number; y: number }) {
  return (
    <>
      <line x1={x} y1={y + 18} x2={x - 8} y2={y + 35} />
      <line x1={x} y1={y + 18} x2={x + 8} y2={y + 35} />
    </>
  );
}

// CHEST
function BarbellBenchPress({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Bench */}
      <rect x={20} y={60} width={60} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <rect x={20} y={66} width={6} height={15} rx={1} />
      <rect x={74} y={66} width={6} height={15} rx={1} />
      {/* Body lying */}
      <Head x={30} y={52} />
      <line x1={30} y1={56} x2={65} y2={60} />
      {/* Arms pressing up */}
      <line x1={40} y1={58} x2={35} y2={40} />
      <line x1={55} y1={59} x2={55} y2={40} />
      {/* Bar */}
      <line x1={25} y1={40} x2={75} y2={40} strokeWidth={3} />
      <circle cx={22} cy={40} r={4} />
      <circle cx={78} cy={40} r={4} />
    </Fig>
  );
}

function InclineBenchPress({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Incline bench */}
      <line x1={25} y1={55} x2={45} y2={35} strokeWidth={4} />
      <rect x={45} y={33} width={6} height={30} rx={2} fill="currentColor" opacity={0.15} />
      {/* Body on incline */}
      <Head x={28} y={42} />
      <line x1={28} y1={46} x2={42} y2={52} />
      {/* Arms pressing up */}
      <line x1={35} y1={49} x2={40} y2={28} />
      <line x1={40} y1={50} x2={48} y2={28} />
      {/* Bar */}
      <line x1={30} y1={28} x2={58} y2={28} strokeWidth={3} />
      <circle cx={27} cy={28} r={4} />
      <circle cx={61} cy={28} r={4} />
    </Fig>
  );
}

function DumbbellBenchPress({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={20} y={60} width={60} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={30} y={52} />
      <line x1={30} y1={56} x2={65} y2={60} />
      <line x1={40} y1={58} x2={32} y2={38} />
      <line x1={55} y1={59} x2={58} y2={38} />
      {/* Dumbbells */}
      <rect x={28} y={33} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={54} y={33} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function InclineDumbbellPress({ className }: Props) {
  return (
    <Fig className={className}>
      <line x1={25} y1={55} x2={42} y2={38} strokeWidth={4} />
      <Head x={28} y={42} />
      <line x1={28} y1={46} x2={38} y2={50} />
      <line x1={33} y1={48} x2={30} y2={26} />
      <line x1={38} y1={49} x2={44} y2={26} />
      <rect x={26} y={21} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={40} y={21} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function DumbbellFly({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={20} y={60} width={60} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={50} y={52} />
      <line x1={50} y1={56} x2={50} y2={60} />
      <line x1={50} y1={56} x2={20} y2={48} />
      <line x1={50} y1={56} x2={80} y2={48} />
      <circle cx={18} cy={48} r={3} />
      <circle cx={82} cy={48} r={3} />
    </Fig>
  );
}

function CableFly({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Cable towers */}
      <rect x={10} y={20} width={4} height={55} fill="currentColor" opacity={0.15} />
      <rect x={86} y={20} width={4} height={55} fill="currentColor" opacity={0.15} />
      {/* Person */}
      <Head x={50} y={35} />
      <line x1={50} y1={39} x2={50} y2={58} />
      <line x1={50} y1={58} x2={42} y2={72} />
      <line x1={50} y1={58} x2={58} y2={72} />
      {/* Arms with cables */}
      <line x1={50} y1={43} x2={25} y2={38} />
      <line x1={50} y1={43} x2={75} y2={38} />
      <line x1={14} y1={25} x2={25} y2={38} strokeDasharray="3 3" />
      <line x1={86} y1={25} x2={75} y2={38} strokeDasharray="3 3" />
    </Fig>
  );
}

function PushUp({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={18} y={45} />
      <line x1={18} y1={49} x2={50} y2={52} />
      <line x1={50} y1={52} x2={82} y2={50} />
      {/* Arms */}
      <line x1={30} y1={50} x2={30} y2={65} />
      <line x1={65} y1={51} x2={65} y2={65} />
      {/* Ground */}
      <line x1={5} y1={66} x2={95} y2={66} strokeDasharray="4 4" opacity={0.3} />
    </Fig>
  );
}

function MachineChestPress({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Machine frame */}
      <rect x={70} y={20} width={8} height={55} rx={2} fill="currentColor" opacity={0.15} />
      {/* Seat */}
      <rect x={25} y={55} width={30} height={6} rx={2} fill="currentColor" opacity={0.15} />
      {/* Person */}
      <Head x={35} y={35} />
      <line x1={35} y1={39} x2={35} y2={55} />
      {/* Arms pushing */}
      <line x1={35} y1={44} x2={30} y2={32} />
      <line x1={35} y1={44} x2={40} y2={32} />
      {/* Machine handles */}
      <line x1={25} y1={28} x2={70} y2={28} strokeWidth={2} />
    </Fig>
  );
}

function PecDeck({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={60} y={20} width={8} height={55} rx={2} fill="currentColor" opacity={0.15} />
      <rect x={25} y={55} width={30} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={35} y={35} />
      <line x1={35} y1={39} x2={35} y2={55} />
      {/* Arms wide on pads */}
      <line x1={35} y1={44} x2={18} y2={35} />
      <line x1={35} y1={44} x2={52} y2={35} />
      <rect x={14} y={30} width={8} height={10} rx={2} fill="currentColor" opacity={0.2} />
      <rect x={48} y={30} width={8} height={10} rx={2} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function Dips({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Bars */}
      <line x1={20} y1={25} x2={20} y2={75} />
      <line x1={80} y1={25} x2={80} y2={75} />
      <line x1={20} y1={30} x2={40} y2={30} />
      <line x1={60} y1={30} x2={80} y2={30} />
      {/* Person */}
      <Head x={50} y={32} />
      <line x1={50} y1={36} x2={50} y2={55} />
      <line x1={50} y1={55} x2={45} y2={70} />
      <line x1={50} y1={55} x2={55} y2={70} />
      {/* Arms on bars */}
      <line x1={50} y1={40} x2={35} y2={30} />
      <line x1={50} y1={40} x2={65} y2={30} />
    </Fig>
  );
}

// BACK
function Deadlift({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={28} />
      <line x1={50} y1={32} x2={50} y2={50} />
      <line x1={50} y1={50} x2={42} y2={68} />
      <line x1={50} y1={50} x2={58} y2={68} />
      {/* Arms holding bar */}
      <line x1={50} y1={38} x2={35} y2={60} />
      <line x1={50} y1={38} x2={65} y2={60} />
      {/* Bar at ground */}
      <line x1={20} y1={72} x2={80} y2={72} strokeWidth={3} />
      <circle cx={18} cy={72} r={4} />
      <circle cx={82} cy={72} r={4} />
    </Fig>
  );
}

function BarbellRow({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={30} />
      <line x1={50} y1={34} x2={50} y2={52} />
      <line x1={50} y1={52} x2={42} y2={68} />
      <line x1={50} y1={52} x2={58} y2={68} />
      {/* Bent torso */}
      <line x1={50} y1={34} x2={45} y2={38} />
      {/* Arms rowing */}
      <line x1={50} y1={42} x2={35} y2={52} />
      <line x1={50} y1={42} x2={65} y2={52} />
      {/* Bar */}
      <line x1={25} y1={52} x2={75} y2={52} strokeWidth={3} />
      <circle cx={22} cy={52} r={4} />
      <circle cx={78} cy={52} r={4} />
    </Fig>
  );
}

function DumbbellRow({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Bench */}
      <rect x={55} y={50} width={35} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={35} y={32} />
      <line x1={35} y1={36} x2={50} y2={50} />
      {/* Support arm on bench */}
      <line x1={45} y1={42} x2={65} y2={50} />
      {/* Rowing arm */}
      <line x1={35} y1={42} x2={30} y2={55} />
      <line x1={30} y1={55} x2={30} y2={42} />
      <circle cx={30} cy={40} r={3} fill="currentColor" opacity={0.2} />
      {/* Legs */}
      <line x1={50} y1={50} x2={50} y2={68} />
      <line x1={50} y1={50} x2={58} y2={68} />
    </Fig>
  );
}

function PullUp({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Bar */}
      <line x1={15} y1={15} x2={85} y2={15} strokeWidth={3} />
      {/* Person hanging */}
      <Head x={50} y={25} />
      <line x1={50} y1={29} x2={50} y2={48} />
      <line x1={50} y1={48} x2={42} y2={65} />
      <line x1={50} y1={48} x2={58} y2={65} />
      {/* Arms up to bar */}
      <line x1={50} y1={33} x2={35} y2={15} />
      <line x1={50} y1={33} x2={65} y2={15} />
    </Fig>
  );
}

function ChinUp({ className }: Props) {
  return (
    <Fig className={className}>
      <line x1={15} y1={15} x2={85} y2={15} strokeWidth={3} />
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={45} />
      <line x1={50} y1={45} x2={42} y2={62} />
      <line x1={50} y1={45} x2={58} y2={62} />
      {/* Underhand grip */}
      <line x1={50} y1={30} x2={40} y2={15} />
      <line x1={50} y1={30} x2={60} y2={15} />
    </Fig>
  );
}

function LatPulldown({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Machine */}
      <line x1={50} y1={10} x2={50} y2={20} strokeWidth={2} />
      <rect x={50} y={8} width={10} height={6} rx={1} fill="currentColor" opacity={0.2} />
      {/* Seat */}
      <rect x={35} y={60} width={30} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={50} y={30} />
      <line x1={50} y1={34} x2={50} y2={58} />
      {/* Arms pulling down */}
      <line x1={50} y1={38} x2={30} y2={20} />
      <line x1={50} y1={38} x2={70} y2={20} />
      <line x1={30} y1={18} x2={70} y2={18} strokeWidth={2} />
      {/* Thigh pad */}
      <rect x={38} y={50} width={24} height={4} rx={1} fill="currentColor" opacity={0.1} />
    </Fig>
  );
}

function CableRow({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Machine */}
      <rect x={75} y={40} width={8} height={30} rx={2} fill="currentColor" opacity={0.15} />
      {/* Seat */}
      <rect x={25} y={58} width={25} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={35} y={32} />
      <line x1={35} y1={36} x2={35} y2={55} />
      {/* Legs braced */}
      <line x1={35} y1={55} x2={50} y2={52} />
      <line x1={50} y1={52} x2={55} y2={58} />
      {/* Arms pulling */}
      <line x1={35} y1={42} x2={60} y2={42} />
      <line x1={60} y1={42} x2={78} y2={42} strokeDasharray="3 3" />
    </Fig>
  );
}

function TbarRow({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={28} />
      <line x1={50} y1={32} x2={50} y2={48} />
      <line x1={50} y1={48} x2={42} y2={62} />
      <line x1={50} y1={48} x2={58} y2={62} />
      {/* Arms gripping T-bar */}
      <line x1={50} y1={40} x2={40} y2={52} />
      <line x1={50} y1={40} x2={60} y2={52} />
      {/* T-bar */}
      <line x1={40} y1={52} x2={20} y2={68} strokeWidth={3} />
      <circle cx={18} cy={70} r={5} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function FacePull({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={78} y={20} width={6} height={50} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={55} y={35} />
      <line x1={55} y1={39} x2={55} y2={58} />
      <line x1={55} y1={58} x2={48} y2={72} />
      <line x1={55} y1={58} x2={62} y2={72} />
      {/* Arms pulling to face */}
      <line x1={55} y1={44} x2={65} y2={32} />
      <line x1={55} y1={44} x2={45} y2={32} />
      <line x1={80} y1={30} x2={65} y2={32} strokeDasharray="3 3" />
      <line x1={80} y1={30} x2={45} y2={32} strokeDasharray="3 3" />
    </Fig>
  );
}

function Hyperextension({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Bench */}
      <line x1={45} y1={45} x2={45} y2={72} strokeWidth={3} />
      <rect x={35} y={42} width={20} height={6} rx={2} fill="currentColor" opacity={0.15} />
      {/* Person */}
      <Head x={30} y={30} />
      <line x1={30} y1={34} x2={42} y2={44} />
      {/* Legs locked in */}
      <line x1={42} y1={44} x2={55} y2={55} />
      <line x1={55} y1={55} x2={55} y2={72} />
    </Fig>
  );
}

// SHOULDERS
function OverheadPress({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      {/* Arms pressing overhead */}
      <line x1={50} y1={32} x2={38} y2={14} />
      <line x1={50} y1={32} x2={62} y2={14} />
      {/* Bar */}
      <line x1={30} y1={14} x2={70} y2={14} strokeWidth={3} />
      <circle cx={27} cy={14} r={4} />
      <circle cx={73} cy={14} r={4} />
    </Fig>
  );
}

function DumbbellOverheadPress({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={35} y={58} width={30} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={50} y={25} />
      <line x1={50} y1={29} x2={50} y2={55} />
      <line x1={50} y1={35} x2={38} y2={16} />
      <line x1={50} y1={35} x2={62} y2={16} />
      <rect x={34} y={12} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={58} y={12} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function LateralRaise({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={25} />
      <line x1={50} y1={29} x2={50} y2={50} />
      <StandingBase x={50} y={50} />
      {/* Arms out to sides */}
      <line x1={50} y1={35} x2={20} y2={30} />
      <line x1={50} y1={35} x2={80} y2={30} />
      <circle cx={18} cy={30} r={3} />
      <circle cx={82} cy={30} r={3} />
    </Fig>
  );
}

function FrontRaise({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={25} />
      <line x1={50} y1={29} x2={50} y2={50} />
      <StandingBase x={50} y={50} />
      {/* Arms in front */}
      <line x1={50} y1={35} x2={35} y2={20} />
      <line x1={50} y1={35} x2={65} y2={20} />
      <circle cx={35} cy={18} r={3} />
      <circle cx={65} cy={18} r={3} />
    </Fig>
  );
}

function RearDeltFly({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={35} />
      <line x1={50} y1={39} x2={50} y2={55} />
      <line x1={50} y1={55} x2={42} y2={70} />
      <line x1={50} y1={55} x2={58} y2={70} />
      {/* Bent over arms out */}
      <line x1={50} y1={43} x2={22} y2={38} />
      <line x1={50} y1={43} x2={78} y2={38} />
      <circle cx={20} cy={38} r={3} />
      <circle cx={80} cy={38} r={3} />
    </Fig>
  );
}

function ArnoldPress({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={35} y={58} width={30} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={50} y={25} />
      <line x1={50} y1={29} x2={50} y2={55} />
      {/* Arms in front then out */}
      <line x1={50} y1={35} x2={35} y2={18} />
      <line x1={50} y1={35} x2={65} y2={18} />
      <rect x={31} y={14} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={59} y={14} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function MachineShoulderPress({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={60} y={15} width={8} height={55} rx={2} fill="currentColor" opacity={0.15} />
      <rect x={30} y={58} width={25} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={40} y={28} />
      <line x1={40} y1={32} x2={40} y2={55} />
      <line x1={40} y1={38} x2={30} y2={18} />
      <line x1={40} y1={38} x2={50} y2={18} />
      <line x1={25} y1={18} x2={55} y2={18} strokeWidth={2} />
    </Fig>
  );
}

function UprightRow({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      {/* Arms pulling up to chin */}
      <line x1={50} y1={32} x2={38} y2={28} />
      <line x1={50} y1={32} x2={62} y2={28} />
      <line x1={38} y1={35} x2={62} y2={35} strokeWidth={3} />
    </Fig>
  );
}

function Shrugs({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={20} />
      {/* Shoulders hunched up */}
      <path d="M 42 26 Q 50 18 58 26" strokeWidth={3} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      <line x1={50} y1={32} x2={35} y2={42} />
      <line x1={50} y1={32} x2={65} y2={42} />
      {/* Dumbbells at sides */}
      <rect x={31} y={42} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={59} y={42} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

// BICEPS
function BarbellCurl({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      {/* Arms curling */}
      <line x1={50} y1={32} x2={38} y2={38} />
      <line x1={38} y1={38} x2={35} y2={28} />
      <line x1={50} y1={32} x2={62} y2={38} />
      <line x1={62} y1={38} x2={65} y2={28} />
      {/* Bar */}
      <line x1={30} y1={28} x2={70} y2={28} strokeWidth={3} />
    </Fig>
  );
}

function DumbbellCurl({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      {/* Arms curling alternating */}
      <line x1={50} y1={32} x2={38} y2={28} />
      <line x1={50} y1={32} x2={65} y2={42} />
      <rect x={34} y={24} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <circle cx={65} cy={44} r={3} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function HammerCurl({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      {/* Arms curling neutral grip */}
      <line x1={50} y1={32} x2={36} y2={26} />
      <line x1={50} y1={32} x2={64} y2={26} />
      <rect x={32} y={22} width={5} height={10} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={62} y={22} width={5} height={10} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function PreacherCurl({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Preacher bench */}
      <line x1={25} y1={40} x2={55} y2={40} strokeWidth={4} fill="currentColor" opacity={0.15} />
      <Head x={35} y={25} />
      <line x1={35} y1={29} x2={40} y2={40} />
      {/* Arm on pad */}
      <line x1={40} y1={38} x2={45} y2={28} />
      <rect x={42} y={24} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function CableCurl({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={45} y={60} width={10} height={8} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      {/* Arms curling cable */}
      <line x1={50} y1={32} x2={40} y2={28} />
      <line x1={50} y1={32} x2={60} y2={28} />
      <line x1={50} y1={64} x2={50} y2={30} strokeDasharray="3 3" />
    </Fig>
  );
}

function ConcentrationCurl({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={20} y={55} width={30} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={35} y={30} />
      <line x1={35} y1={34} x2={35} y2={52} />
      {/* Arm braced on leg */}
      <line x1={35} y1={40} x2={30} y2={28} />
      <rect x={27} y={24} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      {/* Leg */}
      <line x1={35} y1={52} x2={25} y2={65} />
    </Fig>
  );
}

// TRICEPS
function TricepPushdown({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={70} y={12} width={8} height={60} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={50} y={28} />
      <line x1={50} y1={32} x2={50} y2={55} />
      <StandingBase x={50} y={55} />
      {/* Arms pushing down */}
      <line x1={50} y1={38} x2={55} y2={48} />
      <line x1={55} y1={48} x2={55} y2={42} />
      <line x1={74} y1={38} x2={55} y2={42} strokeDasharray="3 3" />
    </Fig>
  );
}

function OverheadTricepExtension({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={48} />
      <StandingBase x={50} y={48} />
      {/* Arms overhead */}
      <line x1={50} y1={32} x2={45} y2={20} />
      <line x1={50} y1={32} x2={55} y2={20} />
      <line x1={45} y1={20} x2={50} y2={10} />
      <line x1={55} y1={20} x2={50} y2={10} />
      <rect x={46} y={8} width={10} height={6} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function SkullCrusher({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={20} y={60} width={60} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={35} y={52} />
      <line x1={35} y1={56} x2={65} y2={60} />
      {/* Arms extending */}
      <line x1={45} y1={55} x2={50} y2={35} />
      <line x1={50} y1={35} x2={55} y2={35} />
      <line x1={55} y1={55} x2={50} y2={35} />
      {/* EZ bar */}
      <line x1={42} y1={35} x2={58} y2={35} strokeWidth={3} />
    </Fig>
  );
}

function CloseGripBench({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={20} y={60} width={60} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={30} y={52} />
      <line x1={30} y1={56} x2={65} y2={60} />
      {/* Narrow grip arms */}
      <line x1={42} y1={57} x2={40} y2={38} />
      <line x1={48} y1={57} x2={48} y2={38} />
      <line x1={32} y1={38} x2={56} y2={38} strokeWidth={3} />
      <circle cx={29} cy={38} r={4} />
      <circle cx={59} cy={38} r={4} />
    </Fig>
  );
}

function DumbbellKickback({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={55} y={45} width={30} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={30} y={30} />
      <line x1={30} y1={34} x2={50} y2={44} />
      {/* Support arm */}
      <line x1={45} y1={40} x2={60} y2={45} />
      {/* Arm kicking back */}
      <line x1={38} y1={38} x2={25} y2={38} />
      <line x1={25} y1={38} x2={15} y2={42} />
      <circle cx={13} cy={42} r={3} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

// LEGS
function BarbellSquat({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      {/* Squatting position */}
      <line x1={50} y1={26} x2={50} y2={42} />
      <line x1={50} y1={42} x2={42} y2={50} />
      <line x1={50} y1={42} x2={58} y2={50} />
      <line x1={42} y1={50} x2={40} y2={65} />
      <line x1={58} y1={50} x2={60} y2={65} />
      {/* Bar on back */}
      <line x1={30} y1={26} x2={70} y2={26} strokeWidth={3} />
      <circle cx={27} cy={26} r={4} />
      <circle cx={73} cy={26} r={4} />
    </Fig>
  );
}

function FrontSquat({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={42} />
      <line x1={50} y1={42} x2={42} y2={50} />
      <line x1={50} y1={42} x2={58} y2={50} />
      <line x1={42} y1={50} x2={40} y2={65} />
      <line x1={58} y1={50} x2={60} y2={65} />
      {/* Front rack */}
      <line x1={35} y1={26} x2={65} y2={26} strokeWidth={3} />
      <line x1={50} y1={26} x2={38} y2={20} />
      <line x1={50} y1={26} x2={62} y2={20} />
    </Fig>
  );
}

function LegPress({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Machine */}
      <rect x={60} y={10} width={10} height={65} rx={2} fill="currentColor" opacity={0.15} />
      {/* Seat */}
      <rect x={15} y={50} width={30} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={25} y={35} />
      <line x1={25} y1={39} x2={25} y2={50} />
      {/* Legs pressing */}
      <line x1={25} y1={45} x2={45} y2={30} />
      <line x1={45} y1={30} x2={60} y2={20} />
      {/* Foot plate */}
      <line x1={55} y1={15} x2={55} y2={30} strokeWidth={3} />
    </Fig>
  );
}

function LegExtension({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={55} y={15} width={10} height={60} rx={2} fill="currentColor" opacity={0.15} />
      <rect x={20} y={52} width={28} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={30} y={32} />
      <line x1={30} y1={36} x2={30} y2={50} />
      {/* Legs extending */}
      <line x1={30} y1={50} x2={45} y2={48} />
      <line x1={45} y1={48} x2={55} y2={38} />
      <circle cx={55} cy={36} r={4} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function LegCurl({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={55} y={15} width={10} height={60} rx={2} fill="currentColor" opacity={0.15} />
      <rect x={20} y={38} width={28} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={30} y={22} />
      <line x1={30} y1={26} x2={30} y2={38} />
      {/* Legs curling */}
      <line x1={30} y1={38} x2={45} y2={42} />
      <line x1={45} y1={42} x2={50} y2={55} />
      <circle cx={50} cy={55} r={4} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function CalfRaise({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={55} y={15} width={10} height={60} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={45} y={18} />
      <line x1={45} y1={22} x2={45} y2={45} />
      <line x1={45} y1={45} x2={40} y2={60} />
      <line x1={45} y1={45} x2={50} y2={60} />
      {/* Standing on toes */}
      <line x1={38} y1={62} x2={42} y2={60} />
      <line x1={48} y1={62} x2={52} y2={60} />
    </Fig>
  );
}

function HackSquat({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Angled machine */}
      <line x1={65} y1={10} x2={65} y2={70} strokeWidth={4} />
      <rect x={60} y={10} width={12} height={10} rx={2} fill="currentColor" opacity={0.2} />
      <Head x={55} y={22} />
      <line x1={55} y1={26} x2={55} y2={42} />
      <line x1={55} y1={42} x2={50} y2={50} />
      <line x1={55} y1={42} x2={60} y2={50} />
      <line x1={50} y1={50} x2={48} y2={62} />
      <line x1={60} y1={50} x2={62} y2={62} />
    </Fig>
  );
}

function BulgarianSplitSquat({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Rear bench */}
      <rect x={60} y={52} width={25} height={5} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={40} y={22} />
      <line x1={40} y1={26} x2={40} y2={45} />
      {/* Front leg */}
      <line x1={40} y1={45} x2={30} y2={58} />
      <line x1={30} y1={58} x2={30} y2={70} />
      {/* Rear leg on bench */}
      <line x1={40} y1={45} x2={55} y2={48} />
      <line x1={55} y1={48} x2={65} y2={52} />
      {/* Dumbbells */}
      <rect x={28} y={38} width={8} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={44} y={38} width={8} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function GobletSquat({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={42} />
      <line x1={50} y1={42} x2={42} y2={50} />
      <line x1={50} y1={42} x2={58} y2={50} />
      <line x1={42} y1={50} x2={40} y2={65} />
      <line x1={58} y1={50} x2={60} y2={65} />
      {/* Dumbbell at chest */}
      <rect x={44} y={26} width={12} height={8} rx={2} fill="currentColor" opacity={0.2} />
      {/* Arms holding */}
      <line x1={50} y1={30} x2={44} y2={28} />
      <line x1={50} y1={30} x2={56} y2={28} />
    </Fig>
  );
}

function WalkingLunge({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={42} />
      {/* Stride */}
      <line x1={50} y1={42} x2={32} y2={55} />
      <line x1={32} y1={55} x2={30} y2={70} />
      <line x1={50} y1={42} x2={65} y2={55} />
      <line x1={65} y1={55} x2={72} y2={68} />
      {/* Dumbbells */}
      <rect x={40} y={36} width={8} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={52} y={36} width={8} height={5} rx={1} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

// GLUTES
function HipThrust({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Bench behind */}
      <rect x={55} y={38} width={25} height={6} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={30} y={35} />
      {/* Body horizontal */}
      <line x1={30} y1={39} x2={55} y2={40} />
      {/* Feet on ground */}
      <line x1={30} y1={42} x2={25} y2={55} />
      <line x1={25} y1={55} x2={25} y2={65} />
      {/* Bar on hips */}
      <line x1={20} y1={40} x2={55} y2={40} strokeWidth={3} />
      <circle cx={18} cy={40} r={4} />
      <circle cx={57} cy={40} r={4} />
    </Fig>
  );
}

function GluteBridge({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Ground */}
      <line x1={5} y1={65} x2={95} y2={65} strokeDasharray="4 4" opacity={0.3} />
      <Head x={22} y={50} />
      {/* Body bridged */}
      <line x1={22} y1={54} x2={50} y2={48} />
      <line x1={50} y1={48} x2={65} y2={50} />
      {/* Feet */}
      <line x1={65} y1={52} x2={65} y2={65} />
      <line x1={22} y1={54} x2={22} y2={65} />
    </Fig>
  );
}

function CablePullThrough({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={78} y={15} width={8} height={55} rx={2} fill="currentColor" opacity={0.15} />
      <Head x={40} y={28} />
      <line x1={40} y1={32} x2={45} y2={48} />
      <line x1={45} y1={48} x2={38} y2={65} />
      <line x1={45} y1={48} x2={52} y2={65} />
      {/* Arms between legs */}
      <line x1={40} y1={38} x2={50} y2={50} />
      <line x1={50} y1={50} x2={80} y2={50} strokeDasharray="3 3" />
    </Fig>
  );
}

// CORE
function Plank({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={20} y={42} />
      <line x1={20} y1={46} x2={75} y2={48} />
      <line x1={20} y1={46} x2={22} y2={58} />
      <line x1={75} y1={48} x2={75} y2={58} />
      <line x1={5} y1={60} x2={95} y2={60} strokeDasharray="4 4" opacity={0.3} />
    </Fig>
  );
}

function CableCrunch({ className }: Props) {
  return (
    <Fig className={className}>
      <rect x={70} y={12} width={8} height={55} rx={2} fill="currentColor" opacity={0.15} />
      {/* Kneeling */}
      <Head x={45} y={32} />
      <line x1={45} y1={36} x2={45} y2={50} />
      <line x1={45} y1={50} x2={40} y2={62} />
      <line x1={40} y1={62} x2={40} y2={65} />
      {/* Arms pulling rope to head */}
      <line x1={45} y1={40} x2={55} y2={28} />
      <line x1={74} y1={25} x2={55} y2={28} strokeDasharray="3 3" />
    </Fig>
  );
}

function HangingLegRaise({ className }: Props) {
  return (
    <Fig className={className}>
      <line x1={20} y1={12} x2={80} y2={12} strokeWidth={3} />
      <Head x={50} y={20} />
      <line x1={50} y1={24} x2={50} y2={40} />
      {/* Arms to bar */}
      <line x1={50} y1={28} x2={35} y2={12} />
      <line x1={50} y1={28} x2={65} y2={12} />
      {/* Legs raised */}
      <line x1={50} y1={40} x2={42} y2={42} />
      <line x1={42} y1={42} x2={42} y2={35} />
      <line x1={50} y1={40} x2={58} y2={42} />
      <line x1={58} y1={42} x2={58} y2={35} />
    </Fig>
  );
}

function RussianTwist({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={28} />
      <line x1={50} y1={32} x2={50} y2={48} />
      {/* Seated, leaning back */}
      <line x1={50} y1={48} x2={40} y2={58} />
      <line x1={50} y1={48} x2={60} y2={58} />
      {/* Legs up */}
      <line x1={40} y1={58} x2={35} y2={50} />
      <line x1={60} y1={58} x2={65} y2={50} />
      {/* Twisting with weight */}
      <line x1={50} y1={38} x2={38} y2={35} />
      <circle cx={36} cy={35} r={3} fill="currentColor" opacity={0.2} />
    </Fig>
  );
}

function AbWheel({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={25} y={42} />
      <line x1={25} y1={46} x2={50} y2={48} />
      {/* Knees */}
      <line x1={50} y1={48} x2={50} y2={62} />
      <line x1={50} y1={62} x2={48} y2={65} />
      {/* Arms rolling out */}
      <line x1={25} y1={46} x2={18} y2={52} />
      <circle cx={16} cy={54} r={5} />
    </Fig>
  );
}

function DeadBug({ className }: Props) {
  return (
    <Fig className={className}>
      <line x1={5} y1={62} x2={95} y2={62} strokeDasharray="4 4" opacity={0.3} />
      <Head x={30} y={50} />
      <line x1={30} y1={54} x2={50} y2={55} />
      {/* Arms up */}
      <line x1={35} y1={53} x2={32} y2={42} />
      {/* Opposite leg extended */}
      <line x1={50} y1={55} x2={70} y2={52} />
      <line x1={50} y1={55} x2={42} y2={45} />
    </Fig>
  );
}

// CARDIO
function JumpRope({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={18} />
      <line x1={50} y1={22} x2={50} y2={42} />
      <StandingBase x={50} y={42} />
      {/* Arms with rope */}
      <line x1={50} y1={30} x2={35} y2={38} />
      <line x1={50} y1={30} x2={65} y2={38} />
      {/* Rope arc */}
      <path d="M 35 38 Q 50 72 65 38" strokeDasharray="3 3" />
    </Fig>
  );
}

function Burpee({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Jumping phase */}
      <Head x={50} y={15} />
      <line x1={50} y1={19} x2={50} y2={35} />
      <line x1={50} y1={35} x2={42} y2={48} />
      <line x1={50} y1={35} x2={58} y2={48} />
      {/* Arms up */}
      <line x1={50} y1={25} x2={35} y2={12} />
      <line x1={50} y1={25} x2={65} y2={12} />
      {/* Arrow down */}
      <line x1={72} y1={20} x2={72} y2={55} strokeDasharray="4 3" />
      <polygon points="68,52 72,60 76,52" fill="currentColor" opacity={0.3} />
    </Fig>
  );
}

function MountainClimber({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={22} y={38} />
      <line x1={22} y1={42} x2={60} y2={48} />
      {/* Arms */}
      <line x1={30} y1={44} x2={28} y2={58} />
      {/* One leg extended, one knee in */}
      <line x1={60} y1={48} x2={78} y2={58} />
      <line x1={60} y1={48} x2={40} y2={42} />
      <line x1={5} y1={60} x2={95} y2={60} strokeDasharray="4 4" opacity={0.3} />
    </Fig>
  );
}

function JumpingJack({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={15} />
      <line x1={50} y1={19} x2={50} y2={40} />
      {/* Legs wide */}
      <line x1={50} y1={40} x2={32} y2={62} />
      <line x1={50} y1={40} x2={68} y2={62} />
      {/* Arms up wide */}
      <line x1={50} y1={26} x2={28} y2={15} />
      <line x1={50} y1={26} x2={72} y2={15} />
    </Fig>
  );
}

function HighKnees({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={15} />
      <line x1={50} y1={19} x2={50} y2={38} />
      {/* One knee up */}
      <line x1={50} y1={38} x2={38} y2={42} />
      <line x1={38} y1={42} x2={38} y2={32} />
      {/* Other leg */}
      <line x1={50} y1={38} x2={58} y2={55} />
      <line x1={58} y1={55} x2={58} y2={62} />
      {/* Arms running */}
      <line x1={50} y1={28} x2={40} y2={35} />
      <line x1={50} y1={28} x2={60} y2={22} />
    </Fig>
  );
}

// FULL BODY
function PowerClean({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={20} />
      <line x1={50} y1={24} x2={50} y2={42} />
      <line x1={50} y1={42} x2={42} y2={58} />
      <line x1={50} y1={42} x2={58} y2={58} />
      {/* Arms in front rack */}
      <line x1={50} y1={30} x2={38} y2={25} />
      <line x1={50} y1={30} x2={62} y2={25} />
      <line x1={35} y1={25} x2={65} y2={25} strokeWidth={3} />
      <circle cx={32} cy={25} r={4} />
      <circle cx={68} cy={25} r={4} />
      {/* Arrow up */}
      <line x1={80} y1={60} x2={80} y2={20} strokeDasharray="4 3" />
      <polygon points="76,23 80,15 84,23" fill="currentColor" opacity={0.3} />
    </Fig>
  );
}

function Snatch({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={15} />
      <line x1={50} y1={19} x2={50} y2={38} />
      <StandingBase x={50} y={38} />
      {/* Arms overhead wide grip */}
      <line x1={50} y1={25} x2={28} y2={12} />
      <line x1={50} y1={25} x2={72} y2={12} />
      <line x1={25} y1={12} x2={75} y2={12} strokeWidth={3} />
      <circle cx={22} cy={12} r={4} />
      <circle cx={78} cy={12} r={4} />
    </Fig>
  );
}

function KettlebellSwing({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={22} />
      <line x1={50} y1={26} x2={50} y2={42} />
      <line x1={50} y1={42} x2={42} y2={55} />
      <line x1={50} y1={42} x2={58} y2={55} />
      {/* Arms swinging KB */}
      <line x1={50} y1={32} x2={50} y2={48} />
      <circle cx={50} cy={14} r={5} fill="currentColor" opacity={0.2} />
      {/* Swing arc */}
      <path d="M 50 48 Q 50 20 50 14" strokeDasharray="3 3" />
    </Fig>
  );
}

function Thruster({ className }: Props) {
  return (
    <Fig className={className}>
      <Head x={50} y={10} />
      <line x1={50} y1={14} x2={50} y2={30} />
      <line x1={50} y1={30} x2={42} y2={38} />
      <line x1={50} y1={30} x2={58} y2={38} />
      <line x1={42} y1={38} x2={40} y2={55} />
      <line x1={58} y1={38} x2={60} y2={55} />
      {/* Bar overhead */}
      <line x1={32} y1={10} x2={68} y2={10} strokeWidth={3} />
      <circle cx={29} cy={10} r={4} />
      <circle cx={71} cy={10} r={4} />
      {/* Down arrow showing squat */}
      <line x1={18} y1={15} x2={18} y2={55} strokeDasharray="4 3" />
      <polygon points="14,52 18,60 22,52" fill="currentColor" opacity={0.3} />
    </Fig>
  );
}

function TurkishGetUp({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Half kneeling */}
      <Head x={40} y={28} />
      <line x1={40} y1={32} x2={40} y2={48} />
      <line x1={40} y1={48} x2={32} y2={62} />
      <line x1={40} y1={48} x2={50} y2={55} />
      {/* Arm overhead */}
      <line x1={40} y1={38} x2={40} y2={14} />
      <circle cx={40} cy={10} r={5} fill="currentColor" opacity={0.2} />
      {/* Other arm on ground */}
      <line x1={40} y1={40} x2={25} y2={55} />
    </Fig>
  );
}

function ManMaker({ className }: Props) {
  return (
    <Fig className={className}>
      {/* Multi-phase: pushup + row + clean + press */}
      <Head x={50} y={18} />
      <line x1={50} y1={22} x2={50} y2={38} />
      <StandingBase x={50} y={38} />
      {/* Arms holding DBs */}
      <line x1={50} y1={28} x2={35} y2={16} />
      <line x1={50} y1={28} x2={65} y2={16} />
      <rect x={31} y={12} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      <rect x={59} y={12} width={10} height={5} rx={1} fill="currentColor" opacity={0.2} />
      {/* Circular arrows showing phases */}
      <circle cx={50} cy={55} r={12} strokeDasharray="4 3" opacity={0.3} />
      <text x={50} y={58} textAnchor="middle" fontSize="8" fill="currentColor" opacity={0.5}>4 in 1</text>
    </Fig>
  );
}

export const EXERCISE_ILLUSTRATIONS: Record<string, React.FC<Props>> = {
  barbell_bench_press: BarbellBenchPress,
  incline_bench_press: InclineBenchPress,
  dumbbell_bench_press: DumbbellBenchPress,
  incline_dumbbell_press: InclineDumbbellPress,
  dumbbell_fly: DumbbellFly,
  cable_fly: CableFly,
  push_up: PushUp,
  machine_chest_press: MachineChestPress,
  pec_deck: PecDeck,
  dips: Dips,
  deadlift: Deadlift,
  barbell_row: BarbellRow,
  dumbbell_row: DumbbellRow,
  pull_up: PullUp,
  chin_up: ChinUp,
  lat_pulldown: LatPulldown,
  cable_row: CableRow,
  tbar_row: TbarRow,
  face_pull: FacePull,
  hyperextension: Hyperextension,
  overhead_press: OverheadPress,
  dumbbell_overhead_press: DumbbellOverheadPress,
  lateral_raise: LateralRaise,
  front_raise: FrontRaise,
  rear_delt_fly: RearDeltFly,
  arnold_press: ArnoldPress,
  machine_shoulder_press: MachineShoulderPress,
  upright_row: UprightRow,
  shrugs: Shrugs,
  barbell_curl: BarbellCurl,
  dumbbell_curl: DumbbellCurl,
  hammer_curl: HammerCurl,
  preacher_curl: PreacherCurl,
  cable_curl: CableCurl,
  concentration_curl: ConcentrationCurl,
  tricep_pushdown: TricepPushdown,
  overhead_tricep_extension: OverheadTricepExtension,
  skull_crusher: SkullCrusher,
  close_grip_bench: CloseGripBench,
  dumbbell_kickback: DumbbellKickback,
  barbell_squat: BarbellSquat,
  front_squat: FrontSquat,
  leg_press: LegPress,
  leg_extension: LegExtension,
  leg_curl: LegCurl,
  calf_raise: CalfRaise,
  hack_squat: HackSquat,
  bulgarian_split_squat: BulgarianSplitSquat,
  goblet_squat: GobletSquat,
  walking_lunge: WalkingLunge,
  hip_thrust: HipThrust,
  glute_bridge: GluteBridge,
  cable_pull_through: CablePullThrough,
  plank: Plank,
  cable_crunch: CableCrunch,
  hanging_leg_raise: HangingLegRaise,
  russian_twist: RussianTwist,
  ab_wheel: AbWheel,
  dead_bug: DeadBug,
  jump_rope: JumpRope,
  burpee: Burpee,
  mountain_climber: MountainClimber,
  jumping_jack: JumpingJack,
  high_knees: HighKnees,
  power_clean: PowerClean,
  snatch: Snatch,
  kettlebell_swing: KettlebellSwing,
  thruster: Thruster,
  turkish_getup: TurkishGetUp,
  man_maker: ManMaker,
};

export function ExerciseIllustration({ imageKey, className, size }: { imageKey: string } & Props) {
  const Illustration = EXERCISE_ILLUSTRATIONS[imageKey];
  if (!Illustration) {
    return (
      <div className={`flex items-center justify-center bg-secondary rounded-xl ${className || ""}`} style={{ width: size || 100, height: size || 100 }}>
        <svg viewBox="0 0 100 100" width={size || 60} height={size || 60} fill="none" stroke="currentColor" strokeWidth="2" opacity={0.3}>
          <circle cx={50} cy={20} r={8} />
          <line x1={50} y1={28} x2={50} y2={55} />
          <line x1={50} y1={55} x2={35} y2={80} />
          <line x1={50} y1={55} x2={65} y2={80} />
          <line x1={50} y1={38} x2={25} y2={55} />
          <line x1={50} y1={38} x2={75} y2={55} />
        </svg>
      </div>
    );
  }
  return <Illustration className={className} size={size} />;
}
