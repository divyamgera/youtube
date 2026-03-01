import "../pagesStyles/Home.css";
import { Sidebar } from "../components/Sidebar";
import { Feed } from "../components/Feed";

export const Home = ({ sidebar }) => {
  return (
    <>
      <Sidebar sidebar={sidebar} />

      <main className="home-container">
        <Feed />
      </main>
    </>
  );
};