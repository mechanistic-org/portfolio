import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface TimeCapsuleProps {
    isOpen: boolean;
    onClose: () => void;
}

export const TimeCapsule: React.FC<TimeCapsuleProps> = ({ isOpen, onClose }) => {
    // Only render on client
    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <React.Fragment>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[19999] bg-black/60 backdrop-blur-sm"
                    />

                    {/* Retro Browser Window */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 20 }}
                        className="fixed inset-4 md:inset-10 z-[20000] flex flex-col shadow-2xl overflow-hidden font-sans"
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
                                    http://enorris-xp/digiME/index.html
                                </div>
                                <div className="px-2 py-[1px] bg-[#3E9F3E] text-white text-[11px] border border-[#2B7A2B] shadow-sm flex items-center gap-1 cursor-pointer hover:brightness-110">
                                    Go
                                </div>
                            </div>
                        </div>

                        {/* --- VIEWPORT (The Content) --- */}
                        <div className="flex-1 bg-white overflow-hidden relative">
                            <iframe
                                src="/digiME/index.html"
                                className="w-full h-full border-none"
                                title="digiME Time Portal"
                            />
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
        </AnimatePresence>,
        document.body
    );
};

export default TimeCapsule;
