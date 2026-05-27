"""Initial schema

Revision ID: 0001_initial
Revises: 
Create Date: 2024-01-01 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'repositories',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('owner', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('full_name', sa.String(), nullable=False, unique=True),
        sa.Column('installation_id', sa.String(), nullable=True),
    )

    op.create_table(
        'pull_requests',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('number', sa.Integer(), nullable=False),
        sa.Column('repo', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=False),
        sa.Column('state', sa.String(20), nullable=False),
        sa.Column('author', sa.String(), nullable=False),
        sa.Column('complexity_score', sa.Float(), nullable=True),
        sa.Column('ai_risk_level', sa.String(20), nullable=True),
        sa.Column('additions', sa.Integer(), default=0),
        sa.Column('deletions', sa.Integer(), default=0),
        sa.Column('changed_files', sa.Integer(), default=0),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.Column('synced_at', sa.DateTime(), nullable=True),
        sa.UniqueConstraint('number', 'repo', name='uq_pr_number_repo'),
    )

    op.create_table(
        'ai_reviews',
        sa.Column('id', sa.String(), primary_key=True),
        sa.Column('pr_number', sa.Integer(), nullable=False),
        sa.Column('repo', sa.String(), nullable=False),
        sa.Column('full_text', sa.Text(), nullable=False),
        sa.Column('risk_level', sa.String(20), nullable=True),
        sa.Column('issue_count', sa.Integer(), default=0),
        sa.Column('model_used', sa.String(100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
    )

    op.create_table(
        'contributors',
        sa.Column('id', sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column('username', sa.String(), nullable=False),
        sa.Column('repo', sa.String(), nullable=False),
        sa.Column('avatar_url', sa.String(), nullable=True),
        sa.Column('pr_count', sa.Integer(), default=0),
        sa.Column('merged_count', sa.Integer(), default=0),
        sa.Column('contribution_score', sa.Float(), default=0.0),
        sa.UniqueConstraint('username', 'repo', name='uq_contributor_repo'),
    )


def downgrade() -> None:
    op.drop_table('contributors')
    op.drop_table('ai_reviews')
    op.drop_table('pull_requests')
    op.drop_table('repositories')
