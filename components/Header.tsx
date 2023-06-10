"use client";

import Image from "next/image";
import logo from "@/public/trello-logo.svg";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import fetchSuggestion from "@/lib/fetchSuggestion";

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);
  //   add useAIStore for below local state
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<string>("");

  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);

    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };

    fetchSuggestionFunc();
  }, [board]);

  return (
    <header>
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50" />
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl">
        {/* Logo */}
        <Image
          src={logo}
          alt="Trello Logo"
          width={300}
          height={100}
          className="w-44 md:w-56 pb-10 md:pb-0 object-contain"
        />
        <div className="flex items-center gap-x-5 flex-1 md:justify-end justify-center w-full">
          {/* Search Bar */}
          <form className="flex items-center md:gap-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial md:h-auto h-12">
            <MagnifyingGlassIcon className="md:h-6 md:w-6 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
              className="flex-1 outline-none p-2"
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>

          {/* Avatar */}
          <Avatar
            className="md:w-[50px] md:h-[50px] w-[40px] h-[40px] "
            name="Sahir Khan"
            round
            size="50"
            color="#0055D1"
          />
        </div>
      </div>

      {/* Suggestions GPT-4 */}
      <div className="flex items-center justify-center px-5 py-2 md:py-5">
        <p className="flex items-center text-sm font-light italic p-5 shadow-xl rounded-xl w-fit max-w-3xl bg-white text-[#0055D1]">
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055D1] mr-1 ${
              loading && "animate-spin"
            }`}
          />
          {suggestion && !loading
            ? suggestion
            : "GPT is summarizing your day..."}
        </p>
      </div>
    </header>
  );
}

export default Header;
