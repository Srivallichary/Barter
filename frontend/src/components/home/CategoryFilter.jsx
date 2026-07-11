import React from "react";

const categories = [
  "All",
  "Textbooks",
  "Electronics",
  "Dorm Decor",
  "Clothing & Gear",
  "Games & Hobbies",
  "Bicycles & Sports"
];

function CategoryFilter({ selectedCategory = "All", onSelectCategory }) {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 mt-8">
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 justify-start md:justify-center no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory && onSelectCategory(category)}
              className={`
                px-4 py-2 text-xs font-semibold rounded-full border whitespace-nowrap cursor-pointer transition-all duration-200
                ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/10 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-800"
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryFilter;
