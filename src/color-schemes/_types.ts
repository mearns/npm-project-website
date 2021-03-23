type Color = string;

export interface Colorscheme {
  name: string;
  light: boolean;
  roles: {
    /**
     * The main background color.
     */
    background: Color;
    /**
     * The primary text color.
     *
     * This should be high contrast with the background color.
     */
    primary: Color;

    /**
     * An alternate text color for things that are meant to stand out _slightly_.
     * This would typically be used for things like titles, but also for things that
     * are meant to mostly just like regular text while still promoting the color
     * scheme. Typically used for shorter texts, as oppose to large blocks of prose.
     *
     * This should be high contrast with the background color, but does not need to be
     * high contrast or readily distinguishable from the primary color.
     */
    accent: Color;

    /**
     * An alternate text color for things that are meant to fade into the background
     * somewhat. These are for things lower on the visual hierarchy, like subtitles.
     *
     * This doesn't really need to be particularly high contrast with anything, and
     * will typically be lower contrast with the background than the primary and accent
     * colors, since the point is for it to fade into the background. But it still needs
     * to be high enough contrast with the background to be readable.
     */
    fade: Color;

    /**
     * A color that is meant to stand out. This will typically be used for non-text visual
     * elements, like background colors or lines.
     */
    highlight: Color;

    /**
     * A color that has high contrast with the highlight color, for use as text or other readable
     * elements against the highlight color as a background, or vice-versa. This is frequently the
     * same as the `fade` color, but does not need to be.
     */
    highlightContrast: Color;

    /**
     * An alternate higlight color, that can be used to accent elements that otherwise feature the
     * highlight color.
     */
    highlightAccent: Color;
  };
}
