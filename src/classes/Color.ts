/// <reference path="../libs/jquery/jquery.d.ts" />

module Paint {
    /**
     * A read-only type representing a Color.
     */
    export class Color {

        // Color in string representations 
        private _hexColor: string;
        private _rgbColor: string;

        // Color components
        private _R: number;
        private _G: number;
        private _B: number;

        constructor(color: string) {
            this.parseColor(color);
        }

        equals(color: Color) {
            return this._hexColor === color._hexColor;
        }

        /**
         * The color in the format #rrggbb
         */
        get HexString(): string {
            return this._hexColor;
        }

        /**
         * The color in the format rgb(r,g,b)
         */
        get RGBString(): string {
            return this._rgbColor;
        }

        /**
         * Red component
         */
        get R(): number {
            return this._R;
        }

        /**
         * Green component
         */
        get G(): number {
            return this._G;
        }

        /**
         * Blue component
         */
        get B(): number {
            return this._B;
        }

        /**
         * Returns a color built with the specified RGB components. 
         */
        static fromRGB(red: number, green: number, blue: number): Color {
            return new Color(Color.rgbComponentsToHex(red, green, blue));
        }

        /**
         * Parse string color to find if it is
         * hex, rgb or malformed
         */
        private parseColor(color: string) {
            if (Color.isHex(color))
                this.setFromHex(color);

            else if (Color.isRGB(color))
                this.setFromRGB(color);

            else // TODO decidere cosa fare in questo caso
                throw new Error('Malformed color');

            var col = this._hexColor.substring(1, 7);
            this._R = parseInt(col.substring(0, 2), 16);
            this._G = parseInt(col.substring(2, 4), 16);
            this._B = parseInt(col.substring(4, 6), 16);
        }

        /**
         * Check if color is valid HEX string
         */
        private static isHex(color: string): boolean {
            return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
        }

        /**
         * Check if color is valid RGB string
         */
        private static isRGB(color: string): boolean {
            return /^rgb\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*\\)$/.test(color);
        }

        /**
         * Set HEX color and RGB (after HEX to RGB conversion)
         */
        private setFromHex(color: string) {
            this._hexColor = color;
            this._rgbColor = Color.hex2rgb(color);
        }

        /**
         * Set RGB color and HEX (after RGB to HEX conversion)
         */
        private setFromRGB(color: string) {
            this._hexColor = Color.rgb2hex(color);
            this._rgbColor = color;
        }

        /**
         * Convert HEX color to RGB color
         */
        private static hex2rgb(color: string): string {
            // Remove initial #
            color = color.substring(1, 7);

            return 'rgb(' +
                parseInt(color.substring(0, 2), 16) + ',' +
                parseInt(color.substring(2, 4), 16) + ',' +
                parseInt(color.substring(4, 6), 16) + ')';
        }

        private static rgbComponentsToHex(r, g, b): string {
            return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
        }

        /**
         * Convert RGB color to HEX color
         */
        private static rgb2hex(color: string): string {
            var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
                r = parseInt(nums[2], 10).toString(16),
                g = parseInt(nums[3], 10).toString(16),
                b = parseInt(nums[4], 10).toString(16);

            return "#" +
                ((r.length == 1 ? "0" + r : r) +
                (g.length == 1 ? "0" + g : g) +
                (b.length == 1 ? "0" + b : b));
        }



        /* Static colors.
         * Given that Color is a read-only type, we initialize once for all the
         * static variables (_White, _Black, ...) and provide a reference to them
         * through a read-only property.
         */

        private static _White = new Color("#FFFFFF");
        static get White(): Color { return Color._White; }

        private static _Black = new Color("#000000");
        static get Black(): Color { return Color._Black; }
    }
}