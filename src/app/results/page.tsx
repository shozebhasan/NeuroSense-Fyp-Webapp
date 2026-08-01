"use client"

import { useRouter } from "next/navigation";
export default function ResultsPage() {
  const router = useRouter()
  return (
    <div>
      {/* top nav buttons div */}
      <div className="flex justify-between px-4 py-2 bg-white">
        <button
          className="border bg-blue-50  text-blue-600 px-4 py-2 rounded cursor-pointer"
          onClick={() => router.back()}
        >
          Go Back
        </button>

        <button className="bg-black text-white px-4 py-2 rounded cursor-pointer">
          How It Works
        </button>
      </div>
      <hr className="text-gray-400" />
      <div className="text-center mt-3">
        <div className="border inline-block p-3 border-green-600 bg-green-200 rounded-lg">
          <p className="font-bold ">Your test Results will appear here</p>
        </div>
      </div>
      {/* main div */}
      <div className="py-10">
        {/* inner div */}
        <div className="flex items-center justify-center">
          {/* results div */}
          <div className=" px-30 py-10 text-center border-3 border-gray-400 rounded-2xl">
            <h1 className="font-bold text-4xl text-blue-600 py-4">Results</h1>
            <p>No Tests Taken Yet</p>
            <div className="py-4">
              <button className="bg-green-400 rounded-lg px-4 py-2 text-center font-bold cursor-pointer hover:bg-green-500">
                Chat About The Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
