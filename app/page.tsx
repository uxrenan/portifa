import { Header } from "@/components/Header/Header";
import { Hero } from "@/components/Hero/Hero";
import { Projects } from "@/components/Projects/Projects";
import { Services } from "@/components/Services/Services";
import { About } from "@/components/About/About";
import { Contact } from "@/components/Contact/Contact";
import { Footer } from "@/components/Footer/Footer";
import { EditorialPause } from "@/components/EditorialPause/EditorialPause";
import { MiniRenan } from "@/components/MiniRenan/MiniRenan";

export default function Home() {
 return <><Header /><Hero /><Projects /><Services /><EditorialPause /><About /><Contact /><Footer /><MiniRenan /></>;
}
