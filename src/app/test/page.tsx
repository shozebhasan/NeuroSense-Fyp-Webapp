"use client"

import { useRouter } from "next/navigation";

export default function TestPage() {
  const router = useRouter();
  return (
    // main div
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
      {/* heading */}
      <div className="text-center mt-3">
        <div className="border inline-block p-3 border-blue-600 bg-blue-200 rounded-lg">
          <p className="font-bold ">
            By attempting the tests below you will have an overview of your
            mental health
          </p>
        </div>
      </div>
      {/* cards div */}
      <div className="py-10 font-sans">
        {/* inner div */}
        <div className="flex flex-row justify-between px-40 gap-5">
          {/* puzzels div */}
          <div className=" p-40 text-center border-3 border-gray-400 rounded-2xl bg-yellow-200 ">
            <h1 className="font-bold text-6xl py-4">Puzzles</h1>
            <p className="text-xl">Attempt puzzle of 1000 pieces for testing your mental health</p>
            <div className="py-4">
              <button className="bg-green-400 text-2xl rounded-lg px-4 py-2 text-center font-bold cursor-pointer hover:bg-green-500 ">
                Attempt
              </button>
            </div>
          </div>
          {/* quiz div */}
          <div className=" p-40 text-center border-3 border-gray-400 rounded-2xl bg-green-100">
            <h1 className="font-bold text-6xl py-4">Quiz</h1>
            <p className="text-xl">Attempt Quiz of 50 questions for testing your mental health</p>
            <div className="py-4">
              <button className="bg-green-400 text-2xl rounded-lg px-4 py-2 text-center font-bold cursor-pointer hover:bg-green-500">
                Attempt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
