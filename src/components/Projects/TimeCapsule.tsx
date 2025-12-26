import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeCapsuleProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TimeCapsule: React.FC<TimeCapsuleProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[10002] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Retro Browser Window */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="fixed inset-4 md:inset-10 z-[10003] flex flex-col shadow-2xl overflow-hidden font-sans"
                        style={{
                            maxWidth: "1000px",
                            margin: "auto",
                            height: "85vh",
                            fontFamily: "Verdana, sans-serif", // The true retro font
                        }}
                    >
                        {/* --- WINDOW FRAME (Windows XP Blue) --- */}
                        <div className="bg-[#0055EA] p-[3px] rounded-t-lg shadow-md flex flex-col gap-[2px]">

                            {/* Title Bar */}
                            <div className="flex items-center justify-between px-2 h-8 bg-gradient-to-r from-[#0058EE] via-[#3A93FF] to-[#0058EE]">
                                <div className="flex items-center gap-2 text-white text-xs font-bold shadow-black drop-shadow-md">
                                    <img src="https://assets.eriknorris.com/c24/rigor/digi_logo_grey_200.gif" className="h-4 w-4 bg-white/10 rounded-sm p-[1px]" />
                                    \\digiME// - General Modeling Guide - Microsoft Internet Explorer
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={onClose} className="w-5 h-5 bg-[#D54737] hover:bg-[#E81123] rounded-[2px] border border-white/50 text-white text-[10px] flex items-center justify-center font-bold">X</button>
                                </div>
                            </div>

                            {/* Menu Bar (File Edit View...) */}
                            <div className="bg-[#ECE9D8] px-2 py-1 flex gap-4 text-[11px] text-black border-b border-white/50">
                                <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">File</span>
                                <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Edit</span>
                                <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">View</span>
                                <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Favorites</span>
                                <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Tools</span>
                                <span className="hover:bg-[#316AC5] hover:text-white px-1 cursor-default">Help</span>
                            </div>

                            {/* Address Bar */}
                            <div className="bg-[#ECE9D8] px-2 py-1 flex items-center gap-2 border-b border-[#ACA899] pb-2">
                                <span className="text-[11px] text-[#444]">Address:</span>
                                <div className="flex-1 bg-white border border-[#7F9DB9] px-1 py-[2px] text-[11px]">
                                    http://enorris-xp/digiME/proe/gen_mod_guide.php
                                </div>
                                <div className="px-2 py-[1px] bg-[#3E9F3E] text-white text-[11px] border border-[#2B7A2B] shadow-sm flex items-center gap-1 cursor-pointer hover:brightness-110">
                                    Go
                                </div>
                            </div>
                        </div>

                        {/* --- VIEWPORT (The Content) --- */}
                        <div className="flex-1 bg-white overflow-y-auto relative scrollbar-retro">

                            {/* Retro Sidebar (The "Frames" feel) */}
                            <div className="flex min-h-full">
                                <div className="w-48 bg-[#F1F1F1] border-r border-[#999] p-4 hidden md:block">
                                    <div className="text-[10px] text-[#666] font-bold mb-4">digiME NAVIGATION</div>
                                    <ul className="space-y-2 text-[11px] text-[#0000FF] underline cursor-pointer">
                                        <li className="hover:text-red-600">Department</li>
                                        <li className="hover:text-red-600">Projects</li>
                                        <li className="hover:text-red-600">Library</li>
                                        <li className="font-bold text-black no-underline bg-[#DDD] px-1 -ml-1">Pro/ENGINEER</li>
                                        <li className="pl-2 text-[10px] text-[#444] no-underline list-disc list-inside">Config Guide</li>
                                        <li className="pl-2 text-[10px] text-[#0000FF] underline">Start Parts</li>
                                        <li className="pl-2 text-[10px] text-[#0000FF] underline">Mapkeys</li>
                                        <li className="hover:text-red-600">Pro/INTRALINK</li>
                                    </ul>

                                    <div className="mt-8 border-t border-[#CCC] pt-4">
                                        <div className="bg-[#FFFFCC] border border-[#CCCC99] p-2 text-[9px] text-[#444]">
                                            <strong className="block mb-1 text-black">ADMIN NOTE:</strong>
                                            Intralink 8.0 upgrade scheduled for Friday 5PM. Please check in all work.
                                        </div>
                                    </div>
                                </div>

                                {/* Main Content Area */}
                                <div className="flex-1 p-6 md:p-8 font-serif leading-relaxed text-black">
                                    {/* Header Graphic Reconstruction */}
                                    <div className="border-b-4 border-[#333] mb-6 pb-2">
                                        <h1 className="text-2xl font-bold text-[#333]">General Modeling Guidelines</h1>
                                        <div className="text-[10px] text-[#666]">Last Updated: Oct 2006 | Author: E. Norris</div>
                                    </div>

                                    <div className="max-w-2xl space-y-6 text-[13px]">
                                        <p>
                                            This document is intended to provide a basic guideline for taking a part or project from concept through Release-To-Production (RTP), <span className="italic">to infinity and beyond</span> using Pro/ENGINEER (ProE).
                                        </p>
                                        <p>
                                            This guide will establish common methods for all users, such that each individual user will understand parts and assemblies created by others.
                                        </p>

                                        <hr className="border-[#999]" />

                                        <div className="bg-[#EFEFEF] p-4 border border-[#CCC]">
                                            <h3 className="font-bold text-[#000080] mb-2 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-[#000080]"></span>
                                                Configuring your local environment
                                            </h3>
                                            <p className="mb-3">
                                                The ProE client is installed on the local machine, the program then "floats" a license over the network. It is <strong>crucial</strong> to follow the accepted practice of locating <code>&lt;proe_loadpoint&gt;</code> on its own partition.
                                            </p>
                                            <p className="font-mono text-[11px] bg-white p-2 border border-[#999] mb-3">
                                                D:\PTC\Wildfire2_M180
                                            </p>
                                            <p className="text-red-600 font-bold text-[11px]">
                                                DO NOT accept the default installation location in the PTC Setup dialog!
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#000080] mb-2 mt-6">Anatomy of a Start Part</h3>
                                            <p className="mb-2">
                                                All startparts have carefully crafted base construction features to provide a strong foundation for further feature creation. There is a lot of intelligence built into the base start part, so let <strong>economy and elegance</strong> be your watch-words.
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1 text-[12px]">
                                                <li><code className="text-[#0000FF] font-bold">CS1_IMPORT</code> (red) - zeroed offset coordinate systems for locating imported geometry.</li>
                                                <li><code className="text-[#0000FF] font-bold">GTOL_*</code> (cyan) - zeroed datums designated as Geometric Tolerance references.</li>
                                                <li><code className="text-[#0000FF] font-bold">PART_WEIGHT</code> - 3D note displaying parameter text driven by relations.</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h3 className="font-bold text-[#000080] mb-2 mt-6">Master Model Technique</h3>
                                            <p className="mb-2">
                                                The Master Model is a part built entirely of curves, surfaces, and construction geometry. This technique is used to accomplish the following design goals:
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1 text-[12px] bg-[#FFFFE0] p-2 border border-[#E0E000]">
                                                <li>Control product ID by defining all major external surfaces.</li>
                                                <li>Communicate inter-part relationships (snaps, bosses).</li>
                                                <li><strong>The Golden Rule:</strong> "When in doubt, leave it out."</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-12 pt-4 border-t border-[#CCC] text-center text-[10px] text-[#999]">
                                        &copy; 2006 Digidesign Mechanical Engineering | <span className="text-blue-600 underline cursor-pointer">Submit Feedback</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Bar */}
                        <div className="h-6 bg-[#ECE9D8] border-t border-white/50 flex items-center px-2 text-[11px] text-[#444] shadow-inner">
                            <span className="flex-1">Done</span>
                            <div className="w-4 h-full border-l border-[#ACA899] mx-1"></div>
                            <span className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-[#3E9F3E]"></div> Internet
                            </span>
                        </div>

                    </motion.div>
                </React.Fragment>
            )}
        </AnimatePresence>
    );
};

export default TimeCapsule;
