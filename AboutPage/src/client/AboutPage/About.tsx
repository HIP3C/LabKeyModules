import * as React from "react";

export const About: React.FC = () => {
  return (
    <div id="About-content">
      <section className="About-content-primary">
        <div className="About-content-text">
          <h2>About ImmuneSpace</h2>
          Please visit <a href="https://immunespace.org">immunespace.org</a> for more information
          about the project.
        </div>
      </section>
    </div>
  );
};
