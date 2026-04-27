const style = document.createElement("style");

style.textContent = `
  * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .topbar {
            background-color: #FFE69C;
            padding: 15px 20px;
            display: flex;
            gap: 10px;

            position: fixed;
            top: 0;
            width: 100%;
            transition: transform 0.3s ease;
            z-index: 1000;
        }
        
        .topbar.hidden {
            transform: translateY(-100%);
        }

        .topbar button {
            background-color: white;
            color: #3e2723;
            padding: 10px 20px;
            font-family: 'Arial', serif;
            font-size: 16px;
            cursor: pointer;
            transition: transform 0.3s ease;
        }

        .topbar button:hover {
            transform: scale(1.1);
        }

        .content {
            padding: 40px;
            flex: 1;
        }

        .footer {
            background-color: #FFE69C;
            color: white;
            padding: 40px 20px;
            text-align: center;
            margin-top: auto;
        }

        .footer h3 {
            margin-bottom: 15px;
        }

        .footer p {
            margin: 8px 0;
            line-height: 1.6;
        }
`;

document.head.appendChild(style);
