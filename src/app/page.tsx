import ChessHome from "@/features/chess/ChessHome";
declare global {
    interface BigInt {
        toJSON(): Number;
    }
}

BigInt.prototype.toJSON = function () { return Number(this) }

export default function Home() {
  return (
    <div className="">
      <main className="">
        <ChessHome />
      </main>
    </div>
  );
}
