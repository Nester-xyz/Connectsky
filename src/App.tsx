import { useState } from "react";

import Layout from "./components/HOC/Navigation/Layout";

export type activePageCheck = "post" | "notification" | "bot" | "settings";

function App() {
  // this activePage is passed to layout and then to bottomBar
  const [activePage, setActivePage] = useState<activePageCheck>("post");

  return (
    <div>
      <Layout activePage={activePage} setActivePage={setActivePage}>
        {activePage}
      </Layout>
    </div>
  );
}

export default App;
