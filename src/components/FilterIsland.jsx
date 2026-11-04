// Props: filterIslandBarAriaLabel, buttonSelectedText, buttonSelectedText2, buttonSelectedText3, buttonSelectedText4, buttonSelectedText5, filterIslandForText, buttonSelectedText6, buttonSelectedText7, buttonSelectedText8, filterIslandPanelAriaLabel, filterIslandLineText, filterAllAriaLabel, filterAllText, filterIslandCloseAriaLabel, workCategoryText, workCategoryText2, workCategoryText3, workCategoryText4, workCategoryText5, workCategoryText6, workCategoryText7, workCategoryText8
export default function FilterIsland(p) {
  return (
    <div className={"filter-island js-filter-island"} data-nav-dark={""} data-state={"hidden"}>
      {"\n"}
      <button type={"button"} className={"filter-island__bar js-island-bar"} aria-expanded={"false"} aria-controls={"filter-island-panel"} aria-label={p.filterIslandBarAriaLabel}>
        {"\n"}
        <span className={"filter-slot filter-island__slot js-island-slot"} data-cycle={""} aria-hidden={"true"}>
          <span className={"button-selected filter-slot__word"} data-category={"graphic-design"}>
            {p.buttonSelectedText}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"copywriting"}>
            {p.buttonSelectedText2}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"photography"}>
            {p.buttonSelectedText3}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"filmmaking"}>
            {p.buttonSelectedText4}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"art-direction"}>
            {p.buttonSelectedText5}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"product-design"}>
            {"Product design"}
          </span>
        </span>
        {"\n"}
        <span className={"filter-island__for"} aria-hidden={"true"}>
          {p.filterIslandForText}
        </span>
        {"\n"}
        <span className={"filter-slot filter-island__slot js-island-slot js-island-slot-right"} data-cycle={""} data-cycle-delay={"1200"} aria-hidden={"true"}>
          <span className={"button-selected filter-slot__word"} data-category={"campaign"}>
            {p.buttonSelectedText6}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"websites"}>
            {p.buttonSelectedText7}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"branding"}>
            {"Branding"}
          </span>
          <span className={"button-selected filter-slot__word"} data-category={"social-media"}>
            {p.buttonSelectedText8}
          </span>
        </span>
        {"\n"}
        <span className={"js-pastille filter-island__count"} aria-hidden={"true"}>
          {"18"}
        </span>
        {"\n"}
      </button>
      {"\n"}
      <div id={"filter-island-panel"} className={"filter-island__panel"} role={"group"} aria-label={p.filterIslandPanelAriaLabel}>
        {"\n"}
        {"\n"}
        {"\n"}
        <div className={"filter-island__top"}>
          {"\n"}
          <p className={"filter-island__line"} style={{"--i":"6"}}>
            {p.filterIslandLineText}
          </p>
          {"\n"}
          <span className={"filter-island__all"} style={{"--i":"6"}}>
            <button type={"button"} className={"js-filter-all button-selected"} aria-label={p.filterAllAriaLabel}>
              {p.filterAllText}
            </button>
          </span>
          {"\n"}
          <button type={"button"} className={"filter-island__close js-island-close"} style={{"--i":"6"}} aria-label={p.filterIslandCloseAriaLabel}>
            {"\n"}
            <svg viewBox={"0 0 30 30"} aria-hidden={"true"} focusable={"false"}>
              <circle cx={"15"} cy={"15"} r={"14"} />
              <path d={"M10.5 10.5l9 9M19.5 10.5l-9 9"} />
            </svg>
            {"\n"}
          </button>
          {"\n"}
        </div>
        {"\n"}
        <div className={"filter-island__lists js-island-lists"}>
          {"\n"}
          <div className={"filter-island__list js-island-list"}>
            {"\n"}
            <button type={"button"} className={"js-work-category button-selected"} data-category={"graphic-design"} data-works-count={"6"} style={{"--i":"5"}}>
              {p.workCategoryText}
              <span className={"button-selected-pastille"}>
                {"6"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"copywriting"} data-works-count={"4"} style={{"--i":"4"}}>
              {p.workCategoryText2}
              <span className={"button-selected-pastille"}>
                {"4"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"photography"} data-works-count={"9"} style={{"--i":"3"}}>
              {p.workCategoryText3}
              <span className={"button-selected-pastille"}>
                {"9"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"filmmaking"} data-works-count={"4"} style={{"--i":"2"}}>
              {p.workCategoryText4}
              <span className={"button-selected-pastille"}>
                {"4"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"art-direction"} data-works-count={"8"} style={{"--i":"1"}}>
              {p.workCategoryText5}
              <span className={"button-selected-pastille"}>
                {"8"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"product-design"} data-works-count={"2"} style={{"--i":"0"}}>
              {"Product design"}
              <span className={"button-selected-pastille"}>
                {"2"}
              </span>
            </button>
            {"\n"}
          </div>
          {"\n"}
          <div className={"filter-island__list filter-island__list--right js-island-list"}>
            {"\n"}
            <button type={"button"} className={"js-work-category button-selected"} data-category={"campaign"} data-works-count={"5"} style={{"--i":"3"}}>
              {p.workCategoryText6}
              <span className={"button-selected-pastille"}>
                {"5"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"websites"} data-works-count={"3"} style={{"--i":"2"}}>
              {p.workCategoryText7}
              <span className={"button-selected-pastille"}>
                {"3"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"branding"} data-works-count={"3"} style={{"--i":"1"}}>
              {"Branding"}
              <span className={"button-selected-pastille"}>
                {"3"}
              </span>
            </button>
            <button type={"button"} className={"js-work-category button-selected"} data-category={"social-media"} data-works-count={"4"} style={{"--i":"0"}}>
              {p.workCategoryText8}
              <span className={"button-selected-pastille"}>
                {"4"}
              </span>
            </button>
            {"\n"}
          </div>
          {"\n"}
        </div>
        {"\n"}
      </div>
      {"\n"}
    </div>
  );
}
