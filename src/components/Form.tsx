'use client'

export default function Form() {
  return (
    <form className="flex flex-col gap-y-2">
      <input
        type="text"
        name="content"
        placeholder="New hoppy"
        className="py-2 px-3 rounded-sm"
      />
      <button type="submit" 
        className="bg-blue-500 text-white py-2 px-3 rounded-sm"
      >
        Submit
      </button>
    </form>
  );
}
