function baseProps(props) {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    ...props,
  };
}

export function IconDashboard(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M4 13.5V6.8A2.8 2.8 0 0 1 6.8 4h3.7A2.8 2.8 0 0 1 13.3 6.8v3.7A2.8 2.8 0 0 1 10.5 13.3H6.8A2.8 2.8 0 0 1 4 10.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10.7 20H6.8A2.8 2.8 0 0 1 4 17.2v-.4A2.8 2.8 0 0 1 6.8 14h3.9A2.8 2.8 0 0 1 13.5 16.8v.4A2.8 2.8 0 0 1 10.7 20Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 10.7V6.8A2.8 2.8 0 0 0 17.2 4h-.4A2.8 2.8 0 0 0 14 6.8v3.9A2.8 2.8 0 0 0 16.8 13.5h.4A2.8 2.8 0 0 0 20 10.7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 17.2A2.8 2.8 0 0 1 17.2 20h-.4A2.8 2.8 0 0 1 14 17.2v-.4A2.8 2.8 0 0 1 16.8 14h.4A2.8 2.8 0 0 1 20 16.8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconBox(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M21 8.5 12 3 3 8.5 12 14l9-5.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 8.5V16a2 2 0 0 0 1 1.7l8 4.6 8-4.6a2 2 0 0 0 1-1.7V8.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconRepeat(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M16 3h5v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21 8a9 9 0 0 0-15-3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 21H3v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M3 16a9 9 0 0 0 15 3"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M20 20l-3.6-3.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSparkles(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 2l1.2 4.1L17 7l-3.8.9L12 12l-1.2-4.1L7 7l3.8-.9L12 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 12l.7 2.4L22 15l-2.3.6L19 18l-.7-2.4L16 15l2.3-.6L19 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M5 13l.7 2.4L8 16l-2.3.6L5 19l-.7-2.4L2 16l2.3-.6L5 13Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconTicket(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="2 3"
      />
    </svg>
  );
}

export function IconArrowDownLeft(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M17 7 7 17"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 7v10h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconArrowUpRight(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M7 17 17 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M7 7h10v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSliders(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M4 6h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18 6h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8 6v0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M4 12h2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10 12h10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M14 12v0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M4 18h8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 18v0"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconActivity(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M4 13h3l2-7 4 14 2-7h5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconAlert(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 17h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M10.3 3.7 2.9 16.6A2 2 0 0 0 4.6 19h14.8a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCoin(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M12 3c4.4 0 8 1.8 8 4s-3.6 4-8 4-8-1.8-8-4 3.6-4 8-4Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 7v5c0 2.2 3.6 4 8 4s8-1.8 8-4V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 12v5c0 2.2 3.6 4 8 4s8-1.8 8-4v-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconTrendUp(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M3 17l6-6 4 4 7-7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 8h6v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBoxes(props) {
  return (
    <svg {...baseProps(props)}>
      <path
        d="M7.5 7.5 12 5l4.5 2.5L12 10 7.5 7.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M4 7v10l8 4 8-4V7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 10v11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
