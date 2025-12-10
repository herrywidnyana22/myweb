import { Chat } from "../chat/chat";
import { Dock } from "../dock/dock";
import { PageTitle } from "./pageTitle";
import { Widget } from "../widget";

export const Home = () => {
    return ( 
        <div
            className="
            relative flex flex-col w-full
            space-y-2 sm:space-y-4 md:space-y-8
            max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto
            "
        >
            {/* <PageTitle/> */}
            <Chat />
            <Widget />
            <Dock />
        </div>
    );
}