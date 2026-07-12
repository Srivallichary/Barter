import React from "react";
import { Search } from "lucide-react";
import Input from "../common/Input";
import Button from "../common/Button";

function SearchBar({
  value,
  onChange,
  onSearchSubmit,
  placeholder = "Search for textbooks, calculators, mini-fridges...",
  className = "",
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(value);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full max-w-3xl mx-auto px-4 ${className}`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-xl">
        <div className="flex-grow">
          <Input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            icon={Search}
            className="border-0 focus:ring-0 focus:border-0 shadow-none !py-3.5 bg-transparent"
            containerClassName="w-full"
            fullWidth
          />
        </div>
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="rounded-xl px-6 py-3.5 sm:py-2.5 font-semibold text-sm cursor-pointer"
        >
          Search
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;