import React from "react";
import { useBoundStore } from "./useBoundStore";

function App() {
  const allFollowing = useBoundStore((state) => state.allFollowing);
  const isVisible = useBoundStore((state) => state.isVisible);

  return isVisible ? (
    <div
      className="App"
      style={{
        background: allFollowing ? "green" : "red",
        width: "100%",
        height: "100%",
      }}
    >
      <header className="App-header">
        <p>TFW Following List</p>
        <button
          onClick={() => useBoundStore.setState({ isVisible: false })}
          style={{
            background: "blueviolet",
            padding: "8px",
            borderRadius: "5px",
          }}
        >
          Hide Layout
        </button>
        {allFollowing && allFollowing.map((el) => <p key={el}>{el}</p>)}
      </header>
    </div>
  ) : null;
}

export default App;
