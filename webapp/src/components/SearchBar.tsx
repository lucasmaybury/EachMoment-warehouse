import { FaSearch } from "react-icons/fa";

type SearchBarProps = {
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const SearchBar = ({ handleSearch }: SearchBarProps) => {
  return (
    <label className="input input-bordered flex items-center gap-2 w-full">
      <input
        type="text"
        onChange={handleSearch}
        placeholder="Search"
        className="grow"
      />
      <FaSearch />
    </label>
  );
};
export default SearchBar;
