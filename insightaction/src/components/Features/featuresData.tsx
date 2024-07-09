import { Feature } from "@/types/feature";

const featuresData: Feature[] = [
  {
    id: 1,
    icon: (
      <svg
        width="35"
        height="35"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M26 2C12.7452 2 2 12.7452 2 26C2 39.2548 12.7452 50 26 50C39.2548 50 50 39.2548 50 26C50 12.7452 39.2548 2 26 2ZM26 46C14.9543 46 6 37.0457 6 26C6 14.9543 14.9543 6 26 6C37.0457 6 46 14.9543 46 26C46 37.0457 37.0457 46 26 46ZM27 12V25H36L25 38V25H16L27 12Z"
          fill="#007AFF"
        />
      </svg>
    ),
    title: "Identify the Habit Loop",
    paragraph:
      "Understand the cue, craving, response, and reward cycle to build lasting habits.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 2,
    icon: (
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 2L2 9L18 16L34 9L18 2ZM34 27L18 34L2 27V9L18 16L34 9V27Z"
          fill="#34C759"
        />
      </svg>
    ),
    title: "Stack Your Habits",
    paragraph:
      "Learn to build new habits on top of existing ones for easier integration into your routine.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 3,
    icon: (
      <svg
        width="37"
        height="37"
        viewBox="0 0 37 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.5 3.08334L4.625 9.25001V17.4167C4.625 25.0208 10.3792 32.1458 18.5 34.5417C26.6208 32.1458 32.375 25.0208 32.375 17.4167V9.25001L18.5 3.08334ZM18.5 18.7292H29.2917C28.4792 24.2083 24.2083 28.9417 18.5 30.9167V18.7292H7.70833V11.3125L18.5 6.54168V18.7292Z"
          fill="#FF9500"
        />
      </svg>
    ),
    title: "Map Your Obstacles",
    paragraph:
      "Prepare for challenges with our 'if-then' planner to maintain consistency in your habits.",
    btn: "Learn More",
    btnLink: "/#",
  },
  {
    id: 4,
    icon: (
      <svg
        width="37"
        height="37"
        viewBox="0 0 37 37"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M30.8333 4.625H6.16667C5.24619 4.625 4.36311 4.98839 3.70948 5.64202C3.05585 6.29565 2.69246 7.17873 2.69246 8.09921V28.9008C2.69246 29.8213 3.05585 30.7044 3.70948 31.358C4.36311 32.0116 5.24619 32.375 6.16667 32.375H30.8333C31.7538 32.375 32.6369 32.0116 33.2905 31.358C33.9441 30.7044 34.3075 29.8213 34.3075 28.9008V8.09921C34.3075 7.17873 33.9441 6.29565 33.2905 5.64202C32.6369 4.98839 31.7538 4.625 30.8333 4.625ZM30.8333 28.9008H6.16667V8.09921H30.8333V28.9008ZM13.875 13.875H23.125V18.5H13.875V13.875Z"
          fill="#5856D6"
        />
      </svg>
    ),
    title: "Set Your Intentions",
    paragraph:
      "Use our implementation intention tool to clearly define when, where, and how you'll perform your habits.",
    btn: "Learn More",
    btnLink: "/#",
  },
];

export default featuresData;
