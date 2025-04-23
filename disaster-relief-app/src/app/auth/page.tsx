import { redirect } from "next/navigation";
const Home: React.FC = () => {
    return redirect('/auth/login')
}
export default Home