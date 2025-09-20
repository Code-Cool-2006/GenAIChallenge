import "../pages/CSS/home.css";
import CareerCard from "../components/CareerCard/CareerCard";
import StatsCards from "../components/StatsCard/StatsCards";
import CoreFeatures from "../components/CoreFeatures/CoreFeatures";

function Home() {
  return (
    <div>
      <div className="div1">
        <CareerCard />
        <StatsCards />
        <CoreFeatures />
      </div>
    </div>
  );
}

export default Home;

