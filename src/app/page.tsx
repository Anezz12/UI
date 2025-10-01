import { CardDemo } from "@/components/Card";
import { Table } from "@/components/Table";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
        <CardDemo />
        <CardDemo />
        <CardDemo />
      </div>
      <div className="mt-12">
        <Table />
      </div>
    </div>
  );
}
