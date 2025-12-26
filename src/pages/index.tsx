import LastNewsWidget from "../components/widgets/LatestNews";
import TitleBox from "../components/utility/TitleBox";
import WeatherWidget from "../components/widgets/Weather";

export default function IndexPage() {

  return (
    <div className="flex flex-col gap-2">
      <TitleBox color="blue" title="Benvenuti al televito" size="lg" />
      <WeatherWidget />
      <LastNewsWidget />
    </div>
  );
}
