import React from "react";
import * as colorschemes from "../color-schemes";
import { Color } from "../color-schemes/_types";

export default function TestPage() {
  const selectColorscheme = React.useCallback(event => {
    setColorschemeName(event.target.value);
  }, []);
  const allColorSchemes = Object.keys(colorschemes);
  const [colorschemeName, setColorschemeName] = React.useState(
    allColorSchemes[0]
  );
  const colorScheme = colorschemes[colorschemeName];
  const {
    background,
    primary,
    accent,
    fade,
    highlight,
    highlightContrast,
    highlightAccent
  } = colorScheme.roles;
  return (
    <div
      css={{
        margin: 0,
        padding: "2em",
        textAlign: "justify",
        fontFamily: "Gotham-Light,sans-serif",
        backgroundColor: background,
        color: primary,
        h1: { fontSize: "32pt", marginBlock: "0 4px" },
        h2: { fontSize: "22pt", marginBlock: "0 4px" },
        ".subtitle": { fontSize: "larger" },
        ".primary": {
          ".highlight": { color: highlight },
          "em, strong": {
            color: accent
          },
          ".title": { color: accent },
          ".subTitle": { color: fade }
        }
      }}
    >
      <select onChange={selectColorscheme} value={colorschemeName}>
        {Object.keys(colorschemes).map(name => (
          <option key={name} value={name}>
            {colorschemes[name].name}
          </option>
        ))}
      </select>
      <section className="primary">
        <nav
          css={{
            height: 40
          }}
        >
          <ul
            css={{
              listStyleType: "none",
              padding: 0,
              li: {
                padding: "0 1em",
                display: "inline",
                a: {
                  textDecoration: "none",
                  color: "inherit"
                },

                "&._current": {
                  color: highlight
                },

                "&:hover": {
                  color: primary
                },

                color: fade,
                "&.standout": {
                  backgroundColor: highlight,
                  padding: 5,
                  color: highlightContrast,
                  "&:hover": {
                    color: accent
                  }
                }
              }
            }}
          >
            <li>
              <a href="#fake-1">fake one</a>
            </li>
            <li className="_current">
              <a href="#fake-2">fake two</a>
            </li>
            <li>
              <a href="#fake-3">fake three</a>
            </li>
            <li className="standout">
              <a href="#fake-4">Register!</a>
            </li>
          </ul>
        </nav>
        <h1 className="title">Welcome to the Test Page</h1>
        <h2 className="subTitle">where you can see how a color scheme looks</h2>
        {Object.entries(colorScheme.roles).map(
          ([role, color]: [string, Color]) => (
            <div
              key={role}
              css={{
                border: `1px solid ${primary}`,
                backgroundColor: color,
                width: 50,
                height: 50,
                display: "inline-block"
              }}
              title={role}
            ></div>
          )
        )}
        <br />
        <div
          css={{
            float: "right",
            backgroundColor: highlight,
            border: `1px solid ${highlightAccent}`,
            color: highlightContrast,
            padding: "1.5em",
            borderRadius: "0.5em",
            marginLeft: "2em"
          }}
        >
          <ol
            css={{
              padding: 0,
              listStylePosition: "inside",
              li: { padding: "0.5ex" }
            }}
          >
            <li>Alpha, Bravo, Charlie</li>
            <li>One, Two, Three</li>
            <li>More...</li>
          </ol>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean{" "}
          <strong>vestibulum</strong>, erat ac{" "}
          <span className="highlight">ullamcorper luctus</span>, turpis lectus
          dictum purus, consectetur tempus sem urna fringilla metus. Quisque vel
          nibh id magna porta dapibus id id lacus. Etiam lectus neque, mollis
          laoreet eleifend in, lacinia vel tellus. Orci varius natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus. Fusce
          efficitur sapien eget justo tincidunt, nec congue magna mollis. Fusce
          interdum tellus quam, ut egestas tellus tempus at. Nam dapibus maximus
          fermentum. Etiam vel pellentesque magna. Vivamus efficitur, nisi a
          dictum ullamcorper, ex lectus fringilla dui, auctor tempus eros velit
          at tellus. Aenean non ullamcorper tortor, a aliquet elit. Ut
          venenatis, libero ac malesuada posuere, ex turpis placerat ipsum, nec
          elementum nibh urna non dui. Nunc tempus, sapien id pulvinar
          imperdiet, metus diam suscipit elit, eget interdum velit sem id massa.
          Ut tincidunt congue lectus eu ultricies. Suspendisse facilisis, mi ac
          mattis lobortis, massa libero vestibulum tellus, id lacinia turpis
          risus maximus mauris. Class aptent taciti sociosqu ad litora torquent
          per conubia nostra, per inceptos himenaeos.
        </p>
        <p>
          Aliquam sed ornare metus. Phasellus{" "}
          <em>sodales massa in varius facilisis</em>. Lorem ipsum dolor sit
          amet, consectetur adipiscing elit. Aenean arcu justo, pulvinar
          fringilla laoreet sed, vulputate non mauris. Nunc dapibus augue arcu,
          sit amet pretium velit rhoncus sit amet. Integer et aliquet elit.
          Nullam tincidunt ullamcorper turpis, eu tincidunt massa fringilla nec.
          Curabitur justo metus, pharetra id odio non, tincidunt porta sapien.
          Morbi nibh diam, interdum sit amet semper non, ullamcorper at quam.
          Integer auctor iaculis bibendum. Vestibulum vehicula tincidunt
          faucibus. Integer dui nibh, fringilla quis dictum ac, mollis ut ante.
          Sed mattis enim sed auctor fringilla. Donec non pellentesque lectus.
        </p>
        <p>
          Vivamus egestas facilisis nibh, in laoreet urna ultrices vel. Proin
          pellentesque dui elementum neque interdum cursus. Etiam diam justo,
          egestas in orci et, vestibulum ornare sapien. Sed eget mauris lorem.
          Pellentesque lacinia ut turpis ac accumsan. Aenean dapibus pulvinar
          diam eget maximus. Aliquam aliquet, metus ut semper interdum, sem
          neque accumsan est, id ornare mauris dui sed massa. In non dui et eros
          mattis sodales. Aliquam eu bibendum lorem, vitae commodo nunc. Nam
          feugiat nulla a felis aliquam mollis. Etiam a porta tortor, et dictum
          justo. Sed pharetra diam mi, tincidunt semper odio gravida sed. Cras
          pellentesque volutpat nisl, a ultrices dolor.
        </p>
      </section>
    </div>
  );
}
