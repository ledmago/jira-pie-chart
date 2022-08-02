import React from "react";

import WarningIcon from "@atlaskit/icon/glyph/warning";
import { Y200 } from "@atlaskit/theme/colors";
import { token } from "@atlaskit/tokens";

import Flag from "@atlaskit/flag";

const FlagWarning = () => {
  return (
    <Flag
      appearance="warning"
      icon={
        <WarningIcon
          label="Warning"
          //   secondaryColor={token("color.background.warning.bold", Y200)}
        />
      }
      id="warning"
      key="warning"
      title="Configuration Required"
      description="Before using this chart, you should configure it from the menu."
    />
  );
};

export default FlagWarning;
