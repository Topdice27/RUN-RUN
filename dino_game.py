import pygame
import random
import sys

# Initialize pygame
pygame.init()

# Constants
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 300
GROUND_HEIGHT = 50
GAME_SPEED = 10
GRAVITY = 1

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)

# Set up the screen
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption('Dino Game')

# Load images with error handling
try:
    # Load and scale images
    dino_img = pygame.transform.scale(pygame.image.load('dino.png').convert_alpha(), (40, 40))
    cactus_img = pygame.transform.scale(pygame.image.load('cactus.png').convert_alpha(), (30, 30))
except pygame.error as e:
    print(f"Unable to load image: {e}")
    pygame.quit()
    sys.exit()

# Print statements to check sizes
print("Scaled dino size:", dino_img.get_size())
print("Scaled cactus size:", cactus_img.get_size())

# Game variables
dino_x = 50
dino_y = SCREEN_HEIGHT - GROUND_HEIGHT - dino_img.get_height()
dino_dy = 0
ground_y = SCREEN_HEIGHT - GROUND_HEIGHT
obstacles = []
score = 0
font = pygame.font.Font(None, 36)

def add_obstacle():
    obstacles.append({
        'x': SCREEN_WIDTH,
        'y': SCREEN_HEIGHT - GROUND_HEIGHT - cactus_img.get_height()
    })

def display_score():
    score_text = font.render(f'Score: {score}', True, BLACK)
    screen.blit(score_text, (10, 10))

def check_collision():
    dino_rect = pygame.Rect(dino_x, dino_y, dino_img.get_width(), dino_img.get_height())
    for obstacle in obstacles:
        obstacle_rect = pygame.Rect(obstacle['x'], obstacle['y'], cactus_img.get_width(), cactus_img.get_height())
        if dino_rect.colliderect(obstacle_rect):
            return True
    return False

# Game loop
running = True
clock = pygame.time.Clock()

while running:
    # Event handling
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE and dino_y == ground_y:
                dino_dy = -15

    # Update
    dino_dy += GRAVITY
    dino_y += dino_dy

    if dino_y > ground_y:
        dino_y = ground_y
        dino_dy = 0

    if random.randint(1, 100) == 1:
        add_obstacle()

    for obstacle in obstacles:
        obstacle['x'] -= GAME_SPEED
        if obstacle['x'] < 0:
            obstacles.remove(obstacle)
            score += 1

    if check_collision():
        print(f'Game Over! Your score: {score}')
        pygame.quit()
        sys.exit()

    # Draw
    screen.fill(WHITE)
    screen.blit(dino_img, (dino_x, dino_y))
    for obstacle in obstacles:
        screen.blit(cactus_img, (obstacle['x'], obstacle['y']))
    display_score()

    pygame.display.flip()

    # Cap the frame rate
    clock.tick(30)

pygame.quit()

