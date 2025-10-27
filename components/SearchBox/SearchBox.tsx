"use client";
import React from "react";
import css from "./SearchBox.module.css";

interface SearchBoxProps {
  value?: string;

  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ value = "", onSearch }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={onSearch}
      value={value}
      aria-label="Search notes"
    />
  );
}
