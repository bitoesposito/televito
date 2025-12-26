import TitleBox from "../components/utility/TitleBox";
import Loader from "../components/utility/Loader";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col gap-2">
      <TitleBox color="red" title="segnale assente" size="lg" />
      
      <Loader time={5} blocks={10} />
    </div>
  );
}