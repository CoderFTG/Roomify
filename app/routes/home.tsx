import Navbar from "../../components/Navbar";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div className="home">
      <Navbar/>
      <h1>Welcome</h1>
    </div>
  )
}
