"use client";

type FilterBarProps = {
    selected: string;
    onChange: (value: string) => void;
};

export default function FilterBar({ selected, onChange }: FilterBarProps) {
    const filters = ["tous", "neuf", "occasion"];

    return (
        <div className="mb-6 flex gap-3">
            {filters.map((filter) => {
                const isActive = selected === filter;

                return (
                    <button
                        key={filter}
                        onClick={() => onChange(filter)}
                        className={`rounded px-4 py-2 border ${isActive ? "bg-white text-black" : "bg-black text-white"
                            }`}
                    >
                        {filter}
                    </button>
                );
            })}
        </div>
    );
}