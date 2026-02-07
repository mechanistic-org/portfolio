import  { useState, useEffect, useRef } from 'react';

interface TerminalGameProps {
    workHistory: any[];
}

export default function TerminalGame({ workHistory }: TerminalGameProps) {
    const [history, setHistory] = useState<string[]>([
        "Welcome to NORRIS-OS v5.0.0",
        "Type 'help' for available commands.",
        ""
    ]);
    const [input, setInput] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        const newHistory = [...history, `> ${cmd}`];

        switch (cleanCmd) {
            case 'help':
                newHistory.push(
                    "Available commands:",
                    "  ls          - List career directories",
                    "  cat [job]   - View job details (e.g., 'cat mechanistic')",
                    "  whoami      - Display user profile",
                    "  clear       - Clear terminal",
                    "  exit        - Return to main site"
                );
                break;
            case 'ls':
                newHistory.push("Directories:");
                workHistory.forEach(job => {
                    newHistory.push(`  drwx------ ${job.company.toLowerCase().replace(/\s/g, '_')}`);
                });
                break;
            case 'whoami':
                newHistory.push("User: Erik Norris", "Role: Mechanical Design Engineer", "Status: Ready for Deployment");
                break;
            case 'clear':
                setHistory([]);
                setInput("");
                return;
            case 'exit':
                window.location.href = "/";
                return;
            default:
                if (cleanCmd.startsWith('cat ')) {
                    const target = cleanCmd.split(' ')[1];
                    const job = workHistory.find(j => j.company.toLowerCase().replace(/\s/g, '_') === target);
                    if (job) {
                        newHistory.push(
                            `--- ${job.company} ---`,
                            `Title: ${job.title}`,
                            `Duration: ${job.start} - ${job.end}`,
                            `Description: ${job.description}`
                        );
                    } else {
                        newHistory.push(`Error: File '${target}' not found.`);
                    }
                } else {
                    newHistory.push(`Command not found: ${cleanCmd}`);
                }
        }

        setHistory(newHistory);
        setInput("");
    };

    return (
        <div className="w-full max-w-4xl h-[600px] bg-black border-4 border-gray-800 rounded-lg p-4 font-mono text-green-500 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex-grow overflow-y-auto space-y-1 custom-scrollbar">
                {history.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap">{line}</div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className="mt-4 flex">
                <span className="mr-2">{'>'}</span>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommand(input);
                    }}
                    className="flex-grow bg-transparent border-none outline-none text-green-500 focus:ring-0"
                    autoFocus
                />
            </div>
        </div>
    );
}
