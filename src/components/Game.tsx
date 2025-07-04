import Phaser from "phaser";

interface WordSet {
  topic: string;
  correctWords: string[];
  wrongWords: string[];
}

export default class GameScene extends Phaser.Scene {
  private frog!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private topicText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private score: number = 0;
  private wordGroup?: Phaser.GameObjects.Group;
  private currentTopic!: WordSet;
  private gameEnded: boolean = false;
  private successImg!: Phaser.GameObjects.Image;
  private nextButton!: Phaser.GameObjects.Text;
  private mistakeCount: number = 0;
  private hearts: Phaser.GameObjects.Image[] = [];
  private failImg!: Phaser.GameObjects.Image;
  private retryButton!: Phaser.GameObjects.Text;

  private resetGame() {
    this.frog?.destroy();
    this.wordGroup?.clear(true, true);
    this.topicText?.destroy();
    this.scoreText?.destroy();
    this.successImg.setVisible(false);
    this.failImg.setVisible(false);
    this.nextButton.setVisible(false);
    this.retryButton.setVisible(false);

    this.hearts.forEach((heart) => heart.destroy());
    this.hearts = [];

    this.score = 0;
    this.mistakeCount = 0;
    this.gameEnded = false;

    this.createGameContent();
  }

  private createGameContent() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;

    this.frog = this.add.sprite(centerX, centerY + 200, "frog");
    this.frog.setOrigin(0.5).setScale(0.4);

    const wordData = this.cache.json.get("wordData") as WordSet[];
    this.currentTopic = Phaser.Utils.Array.GetRandom(wordData);

    this.topicText = this.add
      .text(centerX, 20, `주제: ${this.currentTopic.topic}`, {
        fontSize: "48px",
        color: "#c92b2b",
        padding: { top: 10, bottom: 10 },
      })
      .setOrigin(0.5, 0);

    this.scoreText = this.add.text(300, 40, `점수: ${this.score}`, {
      fontSize: "32px",
      color: "#ffff00",
      padding: { top: 10, bottom: 10 },
    });

    const returnBtn = this.add
      .image(120, 60, "returnBtn")
      .setOrigin(0.5)
      .setScale(0.2)
      .setInteractive({ useHandCursor: true });

    returnBtn.on("pointerdown", () => {
      window.location.href = "/";
    });

    this.wordGroup = this.add.group();

    const allWords = [
      ...this.currentTopic.correctWords.map((text) => ({
        text,
        correct: true,
      })),
      ...this.currentTopic.wrongWords.map((text) => ({ text, correct: false })),
    ];
    Phaser.Utils.Array.Shuffle(allWords);

    allWords.forEach(({ text, correct }) => {
      const x = Phaser.Math.Between(50, width - 150);
      const y = Phaser.Math.Between(100, height - 100);

      const label = this.add
        .text(0, 0, text, {
          fontSize: "28px",
          color: "#000000",
        })
        .setOrigin(0.5);

      const bubble = this.add.image(0, 0, "textBubble").setOrigin(0.5);
      bubble.setDisplaySize(label.width + 90, label.height + 80);

      const container = this.add.container(x, y, [bubble, label]);
      container.setSize(bubble.displayWidth, bubble.displayHeight);
      container.setData("correct", correct);
      container.setData("dx", Phaser.Math.FloatBetween(-0.3, 0.3));
      container.setData("dy", Phaser.Math.FloatBetween(-0.3, 0.3));
      this.wordGroup!.add(container);
    });

    for (let i = 0; i < 3; i++) {
      const heart = this.add
        .image(width - 50 - i * 60, 50, "heart")
        .setScale(0.05)
        .setScrollFactor(0);
      this.hearts.push(heart);
    }
  }

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.image("background", "/img/bg_3.png");
    this.load.image("num3", "/img/num_3.png");
    this.load.image("num2", "/img/num_2.png");
    this.load.image("num1", "/img/num_1.png");
    this.load.image("startText", "/img/text_start.png");
    this.load.image("frog", "/img/frogChar1.png");
    this.load.image("frog2", "/img/frogChar2.png");
    this.load.json("wordData", "/data/wordData.json");
    this.load.image("textBubble", "/img/textBubble.png");
    this.load.image("successText", "/img/textSuccess.png");
    this.load.image("returnBtn", "/img/returnBtn.png");
    this.load.image("failText", "/img/textFaile.png");
    this.load.image("heart", "/img/heartIcon.png");
  }

  create() {
    const { width, height } = this.sys.game.canvas;
    const centerX = width / 2;
    const centerY = height / 2;
    const bg = this.add.image(centerX, centerY, "background");
    bg.setDisplaySize(width, height);

    const img3 = this.add.image(centerX, centerY, "num3").setVisible(false);
    const img2 = this.add.image(centerX, centerY, "num2").setVisible(false);
    const img1 = this.add.image(centerX, centerY, "num1").setVisible(false);
    const imgStart = this.add
      .image(centerX, centerY, "startText")
      .setVisible(false);

    this.successImg = this.add
      .image(centerX, centerY, "successText")
      .setVisible(false);

    this.time.delayedCall(0, () => img3.setVisible(true));
    this.time.delayedCall(1000, () => {
      img3.setVisible(false);
      img2.setVisible(true);
    });
    this.time.delayedCall(2000, () => {
      img2.setVisible(false);
      img1.setVisible(true);
    });
    this.time.delayedCall(3000, () => {
      img1.setVisible(false);
      imgStart.setVisible(true);
    });

    this.time.delayedCall(4000, () => {
      imgStart.setVisible(false);
      console.log("게임 시작!");

      this.gameEnded = false;

      this.frog = this.add.sprite(centerX, centerY + 200, "frog");
      this.frog.setOrigin(0.5).setScale(0.4);

      const wordData = this.cache.json.get("wordData") as WordSet[];
      this.currentTopic = Phaser.Utils.Array.GetRandom(wordData);

      this.topicText = this.add
        .text(centerX, 20, `주제: ${this.currentTopic.topic}`, {
          fontSize: "48px",
          color: "#c92b2b",
          padding: { top: 10, bottom: 10 },
        })
        .setOrigin(0.5, 0);

      this.scoreText = this.add.text(300, 40, `점수: ${this.score}`, {
        fontSize: "32px",
        color: "#ffff00",
        padding: { top: 10, bottom: 10 },
      });

      const returnBtn = this.add
        .image(120, 60, "returnBtn")
        .setOrigin(0.5)
        .setScale(0.2)
        .setInteractive({ useHandCursor: true });

      returnBtn.on("pointerdown", () => {
        window.location.href = "/";
      });

      this.wordGroup = this.add.group();

      const allWords = [
        ...this.currentTopic.correctWords.map((text) => ({
          text,
          correct: true,
        })),
        ...this.currentTopic.wrongWords.map((text) => ({
          text,
          correct: false,
        })),
      ];
      Phaser.Utils.Array.Shuffle(allWords);

      allWords.forEach(({ text, correct }) => {
        const x = Phaser.Math.Between(50, width - 150);
        const y = Phaser.Math.Between(100, height - 100);

        const label = this.add
          .text(0, 0, text, {
            fontSize: "28px",
            color: "#000000",
          })
          .setOrigin(0.5);

        const paddingX = 90;
        const paddingY = 80;

        const bubble = this.add.image(0, 0, "textBubble").setOrigin(0.5);
        bubble.setDisplaySize(label.width + paddingX, label.height + paddingY);

        const container = this.add.container(x, y, [bubble, label]);

        container.setSize(bubble.displayWidth, bubble.displayHeight);
        container.setData("correct", correct);
        container.setData("dx", Phaser.Math.FloatBetween(-0.3, 0.3));
        container.setData("dy", Phaser.Math.FloatBetween(-0.3, 0.3));
        this.wordGroup!.add(container);
      });
    });

    this.cursors = this.input!.keyboard!.createCursorKeys();
    this.spaceKey = this.input!.keyboard!.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.nextButton = this.add
      .text(centerX, centerY + 150, "다음 ▶", {
        fontSize: "40px",
        color: "#ffffff",
        backgroundColor: "#1e90ff",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.failImg = this.add
      .image(centerX, centerY, "failText")
      .setVisible(false);

    for (let i = 0; i < 3; i++) {
      const heart = this.add
        .image(width - 50 - i * 60, 50, "heart")
        .setScale(0.05)
        .setScrollFactor(0);
      this.hearts.push(heart);
    }
    this.retryButton = this.add
      .text(centerX, centerY + 150, "다시하기", {
        fontSize: "36px",
        color: "#ffffff",
        backgroundColor: "#ff4444",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive()
      .setVisible(false);

    this.retryButton.on("pointerdown", () => {
      this.resetGame();
    });
  }

  update() {
    if (
      !this.frog ||
      !this.cursors ||
      !this.spaceKey ||
      !this.wordGroup ||
      this.gameEnded
    )
      return;

    const speed = 3;
    const marginX = 20;
    const marginY = 20;

    if (this.cursors.left?.isDown) {
      this.frog.x -= speed;
      this.frog.setFlipX(true);
    } else if (this.cursors.right?.isDown) {
      this.frog.x += speed;
      this.frog.setFlipX(false);
    }
    if (this.cursors.up?.isDown) this.frog.y -= speed;
    if (this.cursors.down?.isDown) this.frog.y += speed;

    this.frog.x = Phaser.Math.Clamp(
      this.frog.x,
      this.frog.displayWidth / 2 - marginX,
      this.sys.game.canvas.width - this.frog.displayWidth / 2 + marginX
    );
    this.frog.y = Phaser.Math.Clamp(
      this.frog.y,
      this.frog.displayHeight / 2 - marginY,
      this.sys.game.canvas.height - this.frog.displayHeight / 2 + marginY
    );

    this.wordGroup.getChildren().forEach((obj) => {
      const container = obj as Phaser.GameObjects.Container;
      container.x += container.getData("dx");
      container.y += container.getData("dy");

      const bounds = container.getBounds();
      const canvasWidth = this.sys.game.canvas.width;
      const canvasHeight = this.sys.game.canvas.height;

      if (bounds.left < 0 || bounds.right > canvasWidth)
        container.setData("dx", -container.getData("dx"));
      if (bounds.top < 80 || bounds.bottom > canvasHeight)
        container.setData("dy", -container.getData("dy"));
    });

    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.frog.setTexture("frog2");
      this.time.delayedCall(150, () => this.frog.setTexture("frog"));

      const overlap = this.wordGroup.getChildren().find((obj) => {
        const container = obj as Phaser.GameObjects.Container;
        return Phaser.Geom.Intersects.RectangleToRectangle(
          this.frog.getBounds(),
          container.getBounds()
        );
      });

      if (overlap) {
        const container = overlap as Phaser.GameObjects.Container;
        const correct = container.getData("correct");

        if (correct) {
          this.score++;

          container.destroy();
          const remainingCorrect = this.wordGroup
            .getChildren()
            .filter((obj) => {
              const container = obj as Phaser.GameObjects.Container;
              return container.getData("correct") === true;
            });

          this.scoreText.setText(`점수: ${this.score}`);

          if (remainingCorrect.length === 0) {
            this.successImg.setVisible(true);
            this.children.bringToTop(this.successImg);

            this.nextButton.setVisible(true);
            this.children.bringToTop(this.nextButton);

            this.nextButton.removeAllListeners();
            this.nextButton.on("pointerdown", () => {
              this.scene.restart();
            });

            this.gameEnded = true;
          }
        } else {
          container.destroy();

          if (this.mistakeCount < 3) {
            this.hearts[this.mistakeCount].setVisible(false);
            this.mistakeCount++;
          }

          if (this.mistakeCount >= 3) {
            this.failImg.setVisible(true);
            this.retryButton.setVisible(true);
            this.children.bringToTop(this.failImg);
            this.children.bringToTop(this.retryButton);
            this.gameEnded = true;
          }
        }

        this.scoreText.setText(`점수: ${this.score}`);
        container.destroy();
      }
    }
  }
}
