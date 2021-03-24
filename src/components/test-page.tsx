import React from "react";
import * as colorschemes from "../color-schemes";
import {
  Color,
  ColorschemeVariant,
  RoleName,
  roles
} from "../color-schemes/_types";
import useHashParam from "../util/use-hash";

export default function TestPage() {
  const allColorschemes = Object.keys(colorschemes);

  const [darkModeStr, setDarkMode] = useHashParam("d", "false");
  const selectDarkMode = React.useCallback(event => {
    setDarkMode(event.target.checked);
  }, []);
  const darkMode: boolean = String(darkModeStr) === "true";

  const [colorschemeName, setColorschemeName] = useHashParam(
    "c",
    allColorschemes[0]
  );

  const baseColorscheme: ColorschemeVariant =
    colorschemes[colorschemeName][darkMode ? "dark" : "light"];

  const colorOverrides: Array<[
    RoleName,
    [string, (v: string) => void]
  ]> = roles.map(roleName => [
    roleName,
    useHashParam(roleName, baseColorscheme[roleName])
  ]);

  const colorscheme = (Object.fromEntries(
    colorOverrides.map(([roleName, [value]]) => [roleName, value])
  ) as Record<RoleName, string>) as ColorschemeVariant;

  const selectColorscheme = React.useCallback(event => {
    setColorschemeName(event.target.value);
    colorOverrides.forEach(([, [, setOverride]]) => setOverride(""));
  }, []);

  const {
    background,
    primary,
    accent,
    fade,
    highlight,
    highlightContrast,
    highlightAccent
  } = colorscheme;

  const hash = "";
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
      <input
        id="darkMode"
        type="checkbox"
        onChange={selectDarkMode}
        checked={darkMode}
      />
      <label htmlFor="darkMode">Dark mode</label>

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
              <a href={`#${hash}`}>fake one</a>
            </li>
            <li className="_current">
              <a href={`#${hash}`}>fake two</a>
            </li>
            <li>
              <a href={`#${hash}`}>fake three</a>
            </li>
            <li className="standout">
              <a href={`#${hash}`}>Register!</a>
            </li>
          </ul>
        </nav>
        <h1 className="title">Welcome to the Test Page</h1>
        <h2 className="subTitle">where you can see how a color scheme looks</h2>
        {Object.entries(colorscheme).map(([role, color]: [string, Color]) => (
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
        ))}
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
