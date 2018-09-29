package scut.domain;

import com.fasterxml.jackson.annotation.JsonView;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Entity
public class Organization {
    public interface WithIdAndName {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;

    // TODO: inferiorOrganizations 需要改回 lazy fetch，否则查询 bridge 的机构时太浪费性能
    // 但直接在 ManyToMany 处修改启动时会抛异常，需要解决这个问题
    @ManyToMany
    @JoinTable(
            name = "superior_organization",
            joinColumns = @JoinColumn(
                    name = "superior_organization_id",
                    referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_superior_organization_superior_organization_id")),
            inverseJoinColumns = @JoinColumn(
                    name = "organization_id",
                    referencedColumnName = "id",
                    foreignKey = @ForeignKey(name = "fk_superior_organization_organization_id")))
    @LazyCollection(LazyCollectionOption.FALSE)
    private Set<Organization> inferiorOrganizations;

    @JsonView(WithIdAndName.class)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @JsonView(WithIdAndName.class)
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Organization> getInferiorOrganizations() {
        return inferiorOrganizations;
    }

    public void setInferiorOrganizations(Set<Organization> inferiorOrganizations) {
        this.inferiorOrganizations = inferiorOrganizations;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Organization that = (Organization) o;
        return id == that.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
