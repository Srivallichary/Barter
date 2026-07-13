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
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="relative rounded-3xl border border-slate-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-indigo-100">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border-0 bg-transparent px-14 py-4 text-sm text-slate-700 placeholder:text-slate-400 focus:ring-0"
          containerClassName="w-full"
          fullWidth
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-2xl px-5 py-3"
        >
          Search
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;