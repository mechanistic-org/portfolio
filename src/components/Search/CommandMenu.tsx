import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface SearchItem {
    id: string;
    title: string;
    type: 'Project' | 'Field Note' | 'Page' | 'System';
    href: string;
    description?: string;
}

// In a real app, this would be passed as props or fetched from a search index
const STATIC_ITEMS: SearchItem[] = [
    { id: 'home', title: 'Home', type: 'Page', href: '/' },
    { id: 'projects', title: 'Projects', type: 'Page', href: '/projects/' },
    { id: 'blog', title: 'Field Notes', type: 'Page', href: '/blog/' },
    { id: 'about', title: 'About', type: 'Page', href: '/about/' },
    { id: 'colophon', title: 'Colophon', type: 'Page', href: '/colophon/' },
    { id: 'docs', title: 'System Documentation', type: 'System', href: '/docs/' },
];

const CommandMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [items, setItems] = useState<SearchItem[]>(STATIC_ITEMS);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Fetch Search Index
    useEffect(() => {
        const fetchIndex = async () => {
            try {
                const res = await fetch('/search-index.json');
                if (res.ok) {
                    const projects = await res.json();
                    setItems([...STATIC_ITEMS, ...projects]);
                }
            } catch (e) {
                console.error("Failed to load search index", e);
            }
        };
        // Fetch immediately or on first open. Fetching immediately ensures it's ready.
        fetchIndex();
    }, []);

    // Toggle with Ctrl+K / Cmd+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        const handleOpenEvent = () => setIsOpen(true);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('open-command-menu', handleOpenEvent);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('open-command-menu', handleOpenEvent);
        };
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    // Filter items
    const filteredItems = items.filter(item => {
        const q = query.toLowerCase();
        return (
            item.title.toLowerCase().includes(q) ||
            item.description?.toLowerCase().includes(q) ||
            item.type.toLowerCase().includes(q)
        );
    }).slice(0, 50); // Limit results for performance

    // Handle navigation
    const handleSelect = (item: SearchItem) => {
        window.location.href = item.href;
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % filteredItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filteredItems[selectedIndex]) {
                handleSelect(filteredItems[selectedIndex]);
            }
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            <div className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-border px-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground mr-3">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search projects, logs, or pages..."
                        className="flex-1 bg-transparent py-4 text-lg outline-none placeholder:text-muted-foreground text-foreground"
                        value={query}
                        onChange={e => {
                            setQuery(e.target.value);
                            setSelectedIndex(0);
                        }}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground border border-border rounded px-1.5 py-0.5">
                        <span className="text-xs">ESC</span>
                    </div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filteredItems.length === 0 ? (
                        <div className="py-12 text-center text-sm text-muted-foreground">
                            No results found.
                        </div>
                    ) : (
                        <ul ref={listRef} className="space-y-1">
                            {filteredItems.map((item, index) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => handleSelect(item)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-sm transition-colors ${index === selectedIndex
                                            ? 'bg-primary/10 text-primary'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.type === 'Project' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                                            )}
                                            {item.type === 'Field Note' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                                            )}
                                            {item.type === 'Page' && (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><line x1="3" x2="21" y1="9" y2="9" /><line x1="9" x2="9" y1="21" y2="9" /></svg>
                                            )}
                                            <span className="font-medium">{item.title}</span>
                                        </div>
                                        <span className="text-xs opacity-50">{item.type}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="border-t border-border bg-muted/50 px-4 py-2 text-xs text-muted-foreground flex justify-between">
                    <span>
                        <kbd className="font-sans">↑↓</kbd> to navigate
                    </span>
                    <span>
                        <kbd className="font-sans">↵</kbd> to select
                    </span>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CommandMenu;
