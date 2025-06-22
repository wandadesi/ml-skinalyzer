interface AnalyzeProps {
  concern: string | string[];
}

const concernDescriptions: Record<string, string> = {
  acne: `Acne is a skin condition that occurs when pores become clogged with oil and bacteria. Treatment includes salicylic acid and benzoyl peroxide.`,
  pimple: `Pimples are small inflamed spots due to clogged pores. Tea tree oil and zinc can help reduce them.`,
  spot: `Dark spots are leftover pigmentation from acne or sun damage. Vitamin C and niacinamide can help brighten them.`,
};

const defaultPositiveMessage = `✨ Great news! Your skin looks healthy and no major concerns were detected. Keep up your amazing skincare routine! 💖`;

const generalCareMessage = `🧴 Here's how to take care of your skin:
- Cleanse twice daily
- Use products that target your concerns
- Apply sunscreen
- Stay hydrated and sleep well`;

export default function Analyze({ concern }: AnalyzeProps) {
  // Handle string (e.g., "acne,spot") or array
  const concernList = typeof concern === "string"
    ? concern === "No concern detected"
      ? []
      : concern.split(",").map(c => c.trim())
    : concern;

  const isClear = concernList.length === 0;

  return (
    <div className="bg-white p-6 rounded-md shadow-lg text-left space-y-3 border border-gray-200">
      <h2 className="font-playfair text-2xl text-[#7a422c]! font-semibold">
        Hi Dear, here’s your result!
      </h2>

      <div>
        <p className="font-montserrat! text-gray-800 font-md mb-5">
          {isClear ? "Skin Status:" : "Skin Concerns Identified:"}
        </p>
        <p className={`font-montserrat! ${isClear ? "text-green-600" : "text-[#7a422c]!"} text-lg font-semibold!`}>
          {isClear ? "No concern detected" : concernList.join(", ")}
        </p>
      </div>

      <div className="font-montserrat text-gray-600 text-sm whitespace-pre-line space-y-3">
        {isClear ? (
          <p>{defaultPositiveMessage}</p>
        ) : (
          <>
            {concernList.map((c) => (
              <div key={c}>
                <p>
                  <strong className="capitalize">{c}:</strong> {concernDescriptions[c] || "No description available."}
                </p>
              </div>
            ))}
            <p className="mt-4">{generalCareMessage}</p>
          </>
        )}
      </div>
    </div>
  );
}
